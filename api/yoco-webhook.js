import crypto from "node:crypto";

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_TIMESTAMP_AGE_SECONDS = 180;

async function readRawBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf8");
}

function signaturesMatch(expected, headerValue) {
  const expectedBytes = Buffer.from(expected);

  return String(headerValue)
    .split(" ")
    .map((entry) => entry.split(","))
    .filter(([version, signature]) => version === "v1" && signature)
    .some(([, signature]) => {
      const signatureBytes = Buffer.from(signature);

      return (
        signatureBytes.length === expectedBytes.length &&
        crypto.timingSafeEqual(signatureBytes, expectedBytes)
      );
    });
}

function verifyYocoSignature({ rawBody, headers, secret }) {
  const webhookId = headers["webhook-id"];
  const timestamp = headers["webhook-timestamp"];
  const signature = headers["webhook-signature"];

  if (!webhookId || !timestamp || !signature) {
    return false;
  }

  const timestampSeconds = Number(timestamp);
  const currentSeconds = Math.floor(Date.now() / 1000);

  if (
    !Number.isFinite(timestampSeconds) ||
    Math.abs(currentSeconds - timestampSeconds) > MAX_TIMESTAMP_AGE_SECONDS
  ) {
    return false;
  }

  const encodedSecret = secret.startsWith("whsec_")
    ? secret.slice("whsec_".length)
    : secret;
  const secretBytes = Buffer.from(encodedSecret, "base64");
  const signedContent = `${webhookId}.${timestamp}.${rawBody}`;
  const expectedSignature = crypto
    .createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64");

  return signaturesMatch(expectedSignature, signature);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const webhookSecret = process.env.YOCO_WEBHOOK_SECRET;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!webhookSecret || !supabaseUrl || !supabaseSecretKey) {
    console.error("Yoco webhook is not configured");
    return response.status(500).json({ error: "Webhook is not configured" });
  }

  try {
    const rawBody = await readRawBody(request);

    if (
      !verifyYocoSignature({
        rawBody,
        headers: request.headers,
        secret: webhookSecret,
      })
    ) {
      return response.status(403).json({ error: "Invalid webhook signature" });
    }

    const event = JSON.parse(rawBody);

    if (event.type !== "payment.succeeded") {
      return response.status(200).json({ received: true });
    }

    const payment = event.payload;
    const checkoutId = payment?.metadata?.checkoutId;
    const planByAmount = {
      7900: "standard",
      12900: "premium",
    };
    const plan = planByAmount[payment?.amount];

    if (
      payment?.mode !== "live" ||
      payment?.status !== "succeeded" ||
      payment?.currency !== "ZAR" ||
      !checkoutId ||
      !payment?.id ||
      !plan
    ) {
      console.error("Rejected unexpected Yoco payment event", {
        eventId: event.id,
        paymentId: payment?.id,
      });
      return response.status(200).json({ received: true });
    }

    const supabaseHeaders = {
      apikey: supabaseSecretKey,
      "Content-Type": "application/json",
    };

    const profileResponse = await fetch(
      `${supabaseUrl}/rest/v1/user_profiles?payment_reference=eq.${encodeURIComponent(
        checkoutId,
      )}&select=user_id&limit=1`,
      { headers: supabaseHeaders },
    );
    const profiles = await profileResponse.json();

    if (!profileResponse.ok || !profiles?.[0]?.user_id) {
      console.error("No profile found for paid Yoco checkout", {
        eventId: event.id,
        checkoutId,
      });
      return response.status(500).json({ error: "Payment profile not found" });
    }

    const updateResponse = await fetch(
      `${supabaseUrl}/rest/v1/user_profiles?user_id=eq.${encodeURIComponent(
        profiles[0].user_id,
      )}&payment_reference=eq.${encodeURIComponent(checkoutId)}`,
      {
        method: "PATCH",
        headers: {
          ...supabaseHeaders,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          plan,
          payment_reference: payment.id,
          updated_at: new Date().toISOString(),
        }),
      },
    );

    if (!updateResponse.ok) {
      console.error("Unable to grant paid access", {
        eventId: event.id,
        status: updateResponse.status,
      });
      return response.status(500).json({ error: "Unable to grant access" });
    }

    return response.status(200).json({ received: true });
  } catch (error) {
    console.error("Yoco webhook processing failed", error);
    return response.status(500).json({ error: "Webhook processing failed" });
  }
}
