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

  const secretKey = process.env.YOCO_SECRET_KEY;

  if (!secretKey) {
    return response
      .status(500)
      .json({ error: "Payment service is not configured" });
  }

  const planId = request.body?.plan;
  const plan = PLANS[planId];

  if (!plan) {
    return response.status(400).json({ error: "Invalid payment plan" });
  }

  try {
    const yocoResponse = await fetch(
      "https://payments.yoco.com/api/checkouts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
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
            plan: planId,
            product: plan.name,
          },
        }),
      },
    );

    const checkout = await yocoResponse.json();

    if (!yocoResponse.ok || !checkout.redirectUrl) {
      console.error("Yoco checkout creation failed", {
        status: yocoResponse.status,
        error: checkout?.message ?? checkout?.error ?? "Unknown Yoco error",
      });

      return response.status(502).json({
        error: "Unable to start checkout",
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