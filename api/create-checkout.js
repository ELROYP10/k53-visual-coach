import { randomUUID } from "node:crypto";

const SITE_URL = "https://k53-visual-coach.vercel.app";

const PLANS = Object.freeze({
  standard: {
    amount: 7900,
    name: "K53 Visual Coach Standard",
  },
  premium: {
    amount: 12900,
    name: "K53 Visual Coach Premium",
  },
});

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const yocoSecretKey = process.env.YOCO_SECRET_KEY;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!yocoSecretKey || !supabaseUrl || !supabaseAnonKey) {
    return response
      .status(500)
      .json({ error: "Payment service is not configured" });
  }

  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return response.status(401).json({ error: "Please sign in first" });
  }

  try {
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: authorization,
        apikey: supabaseAnonKey,
      },
    });

    const user = await userResponse.json();

    if (!userResponse.ok || !user?.id) {
      return response
        .status(401)
        .json({ error: "Your sign-in session is invalid" });
    }

    const planId = request.body?.plan;
    const plan = PLANS[planId];

    if (!plan) {
      return response.status(400).json({ error: "Invalid payment plan" });
    }

    const yocoResponse = await fetch(
      "https://payments.yoco.com/api/checkouts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${yocoSecretKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": randomUUID(),
        },
        body: JSON.stringify({
          amount: plan.amount,
          currency: "ZAR",
          successUrl: `${SITE_URL}/?payment=success`,
          cancelUrl: `${SITE_URL}/?payment=cancelled`,
          failureUrl: `${SITE_URL}/?payment=failed`,
          metadata: {
            user_id: user.id,
            plan: planId,
            product: plan.name,
          },
        }),
      },
    );

    const checkout = await yocoResponse.json();

    if (!yocoResponse.ok || !checkout.id || !checkout.redirectUrl) {
      console.error("Yoco checkout creation failed", {
        status: yocoResponse.status,
        error: checkout?.message ?? checkout?.error ?? "Unknown Yoco error",
      });

      return response.status(502).json({
        error: "Unable to start checkout",
      });
    }

    const profileResponse = await fetch(
      `${supabaseUrl}/rest/v1/user_profiles?user_id=eq.${encodeURIComponent(
        user.id,
      )}`,
      {
        method: "PATCH",
        headers: {
          Authorization: authorization,
          apikey: supabaseAnonKey,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          payment_reference: checkout.id,
          updated_at: new Date().toISOString(),
        }),
      },
    );

    if (!profileResponse.ok) {
      console.error("Unable to save pending checkout", {
        status: profileResponse.status,
        checkoutId: checkout.id,
      });

      return response.status(500).json({
        error: "Unable to prepare payment",
      });
    }

    return response.status(200).json({
      checkoutId: checkout.id,
      redirectUrl: checkout.redirectUrl,
    });
  } catch (error) {
    console.error("Checkout server error", error);

    return response.status(500).json({
      error: "Unable to start checkout",
    });
  }
}
