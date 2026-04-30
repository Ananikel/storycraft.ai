import Stripe from "stripe";

const priceIds = {
  starter: process.env.STRIPE_PRICE_STARTER,
  creator: process.env.STRIPE_PRICE_CREATOR,
  pro: process.env.STRIPE_PRICE_PRO
};

export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.setHeader("Allow", "POST, OPTIONS");
    return response.status(204).end();
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST, OPTIONS");
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return response.status(500).json({ error: "Missing STRIPE_SECRET_KEY" });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { planKey, successUrl, cancelUrl } = request.body ?? {};
  const price = priceIds[planKey];

  if (!price) {
    return response.status(400).json({ error: "Unknown or unconfigured subscription plan." });
  }

  const origin = request.headers.origin ?? `https://${request.headers.host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: successUrl || `${origin}/?checkout=success#studio`,
      cancel_url: cancelUrl || `${origin}/?checkout=cancelled#pricing`,
      allow_promotion_codes: true,
      metadata: {
        planKey
      }
    });

    return response.status(200).json({ url: session.url });
  } catch (error) {
    return response.status(500).json({
      error: "Unable to create Stripe Checkout Session.",
      detail: error.message
    });
  }
}
