import { CheckCircle2, Crown, Rocket, Sparkles } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { startStripeCheckout } from "../services/SubscriptionService.js";

const plans = [
  {
    key: "starter",
    name: "Starter",
    price: "9$",
    icon: Sparkles,
    features: ["5 storybooks", "Export PDF standard", "FR/EN i18n", "3 styles visuels"]
  },
  {
    key: "creator",
    name: "Créateur",
    price: "29$",
    icon: Rocket,
    featured: true,
    features: ["25 storybooks", "Texte bilingue", "Images cohérentes", "Export PDF premium"]
  },
  {
    key: "pro",
    name: "Pro",
    price: "79$",
    icon: Crown,
    features: ["Storybooks illimités", "Workflow équipe", "Langues locales", "Support prioritaire"]
  }
];

export default function Pricing() {
  const { t } = useTranslation();
  const [processingPlan, setProcessingPlan] = useState("");
  const [checkoutError, setCheckoutError] = useState("");

  async function handleChoosePlan(planKey) {
    setProcessingPlan(planKey);
    setCheckoutError("");

    try {
      await startStripeCheckout(planKey);
    } catch {
      setCheckoutError("Paiement indisponible. Vérifiez l'endpoint Stripe côté backend.");
      setProcessingPlan("");
    }
  }

  return (
    <section id="pricing" className="border-y border-white/10 bg-white/[0.025] py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-neon">{t("pricing")}</p>
          <h2 className="mt-4 font-book text-4xl font-bold text-white md:text-5xl">
            {t("plansTitle")}
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <article
                key={plan.key}
                className={`rounded-lg border p-7 ${
                  plan.featured
                    ? "border-neon bg-neon/10 shadow-neon"
                    : "border-white/10 bg-zinc-950/72"
                }`}
              >
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-extrabold text-white">{plan.name}</h3>
                    <p className="mt-3 text-zinc-400">
                      <span className="text-4xl font-extrabold text-white">{plan.price}</span>{" "}
                      {t("monthly")}
                    </p>
                  </div>
                  <div className="rounded-lg border border-neon/30 bg-neon/10 p-3 text-neon">
                    <Icon size={26} />
                  </div>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-zinc-200">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-neon" size={18} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleChoosePlan(plan.key)}
                  disabled={processingPlan === plan.key}
                  className="mt-8 w-full rounded-lg border border-neon/60 bg-neon px-4 py-3 text-sm font-extrabold text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {processingPlan === plan.key ? "Redirection Stripe..." : `${t("choose")} ${plan.name}`}
                </button>
              </article>
            );
          })}
        </div>
        {checkoutError ? <p className="mt-5 text-sm font-semibold text-red-300">{checkoutError}</p> : null}
      </div>
    </section>
  );
}
