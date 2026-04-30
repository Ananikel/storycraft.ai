const API_BASE_URL = import.meta.env.VITE_STORYCRAFT_API_URL || "/api";

export async function startStripeCheckout(planKey) {
  const response = await fetch(`${API_BASE_URL}/billing/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      planKey,
      successUrl: `${window.location.origin}/?checkout=success#studio`,
      cancelUrl: `${window.location.origin}/?checkout=cancelled#pricing`
    })
  });

  if (!response.ok) {
    throw new Error(`Stripe checkout failed: ${response.status}`);
  }

  const session = await response.json();

  if (!session.url) {
    throw new Error("Stripe checkout response did not include a redirect URL.");
  }

  window.location.assign(session.url);
}
