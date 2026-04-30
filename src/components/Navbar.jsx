import { UserCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import storycraftLogo from "../assets/storycraft-logo.png";

export default function Navbar() {
  const { t, i18n } = useTranslation();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/88 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#top" className="flex items-center">
          <img
            src={storycraftLogo}
            alt="StoryCraft AI"
            className="h-9 w-auto object-contain"
            decoding="async"
          />
        </a>

        <div className="hidden items-center gap-8 text-sm font-semibold text-zinc-300 md:flex">
          <a className="transition hover:text-neon" href="#pricing">
            {t("pricing")}
          </a>
          <a className="transition hover:text-neon" href="#studio">
            {t("workspace")}
          </a>
        </div>

        <div className="flex items-center gap-3">
          <select
            aria-label="Language Switcher"
            value={i18n.language}
            onChange={(event) => i18n.changeLanguage(event.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-neon"
          >
            <option className="bg-zinc-950" value="fr">
              FR
            </option>
            <option className="bg-zinc-950" value="en">
              EN
            </option>
          </select>
          <button className="inline-flex items-center gap-2 rounded-lg bg-neon px-4 py-2 text-sm font-bold text-zinc-950 shadow-neon transition hover:bg-emerald-300">
            <UserCircle size={18} />
            <span className="hidden sm:inline">{t("profile")}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
