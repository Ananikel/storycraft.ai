import { ArrowRight, BookOpenCheck, Languages, Palette, Volume2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import CreationDashboard from "./components/CreationDashboard.jsx";
import Navbar from "./components/Navbar.jsx";
import Pricing from "./components/Pricing.jsx";

export default function App() {
  const { t } = useTranslation();

  return (
    <div id="top" className="min-h-screen bg-ink text-white">
      <Navbar />
      <main>
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-24">
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-lg border border-neon/40 bg-neon/10 px-3 py-2 text-sm font-bold text-neon">
                <BookOpenCheck size={18} />
                SaaS Multilingue
              </div>
              <h1 className="font-book text-5xl font-bold leading-none tracking-normal text-white md:text-7xl">
                {t("landingHeroTitle")}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
                {t("landingHeroSubtitle")}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#studio"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-neon px-5 py-3 font-extrabold text-zinc-950 shadow-neon transition hover:bg-emerald-300"
                >
                  {t("startProject")}
                  <ArrowRight size={18} />
                </a>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-5 py-3 font-bold text-white transition hover:border-neon/60"
                >
                  {t("viewPricing")}
                </a>
              </div>
            </div>

            <div className="relative min-h-[440px] rounded-lg border border-white/10 bg-zinc-950/72 p-4 shadow-2xl">
              <div className="grid h-full gap-4 md:grid-cols-[0.85fr_1.15fr]">
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-neon">
                    Agentic Workflow
                  </p>
                  <div className="mt-8 space-y-4">
                    {["Prompt", "Script", "Images", "PDF"].map((item, index) => (
                      <div key={item} className="rounded-lg border border-white/10 bg-black/30 p-4">
                        <p className="text-sm font-bold text-zinc-400">0{index + 1}</p>
                        <p className="mt-1 text-lg font-extrabold">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-[#f7f1e7] p-6 text-zinc-950">
                  <div className="h-full rounded-lg border border-zinc-300 bg-white p-7">
                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">
                      Storybook Preview
                    </p>
                    <h2 className="mt-8 font-book text-5xl font-bold leading-none">Le Jardin des Étoiles</h2>
                    <div className="mt-8 aspect-[4/3] rounded-lg bg-gradient-to-br from-emerald-200 via-yellow-100 to-sky-200" />
                    <p className="mt-7 font-book text-2xl leading-8">
                      Une aventure tendre, bilingue et prête pour une édition premium.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-zinc-950/40 py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-neon">Features</p>
              <h2 className="mt-4 font-book text-4xl font-bold text-white md:text-5xl">
                {t("featuresTitle")}
              </h2>
              <p className="mt-4 text-lg leading-8 text-zinc-400">{t("featuresSubtitle")}</p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <FeatureCard
                icon={Palette}
                title={t("visualConsistency")}
                copy={t("visualConsistencyCopy")}
              />
              <FeatureCard
                icon={Languages}
                title={t("culturalTranslation")}
                copy={t("culturalTranslationCopy")}
              />
              <FeatureCard icon={Volume2} title={t("localVoice")} copy={t("localVoiceCopy")} />
            </div>
          </div>
        </section>

        <Pricing />
        <CreationDashboard />
      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, copy }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.035] p-6 transition hover:border-neon/60 hover:bg-neon/5">
      <div className="mb-7 inline-flex rounded-lg border border-neon/30 bg-neon/10 p-3 text-neon shadow-neon">
        <Icon size={26} />
      </div>
      <h3 className="text-2xl font-extrabold text-white">{title}</h3>
      <p className="mt-4 leading-7 text-zinc-400">{copy}</p>
    </article>
  );
}
