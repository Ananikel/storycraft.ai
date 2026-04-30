import { Download, FileText, Image, Languages, Loader2, Save, Settings2, Volume2, WandSparkles } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { generateBilingualScript, generateConsistentVisuals } from "../services/AIService.js";
import { saveStorybookDraft } from "../services/StorybookRepository.js";

const storybookLanguages = [
  "Français",
  "Anglais",
  "Wolof",
  "Lingala",
  "Bambara",
  "Swahili",
  "Fon",
  "Éwé",
  "Mina"
];
const visualStyles = ["Watercolor premium", "3D doux", "Conte africain moderne", "Papercut éditorial"];

const steps = [
  { label: "Paramètres", icon: Settings2 },
  { label: "Génération du Script", icon: FileText },
  { label: "Génération des Images", icon: Image },
  { label: "Export PDF", icon: Download }
];

export default function CreationDashboard() {
  const { t } = useTranslation();
  const bookPreviewRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [form, setForm] = useState({
    title: "Le Jardin des Étoiles",
    theme: "Amitié, courage et découverte",
    style: visualStyles[0],
    language: storybookLanguages[0],
    secondLanguage: storybookLanguages[1],
    characterRef: "Awa, 8 ans, robe verte, sac jaune, sourire curieux",
    scene: "Awa découvre une graine lumineuse dans la cour de son école."
  });
  const [status, setStatus] = useState("Prêt pour la création.");

  const progressWidth = useMemo(() => `${((activeStep + 1) / steps.length) * 100}%`, [activeStep]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleScriptGeneration() {
    setActiveStep(1);
    setStatus("Préparation du script bilingue...");
    try {
      await generateBilingualScript(form.theme, form.language, form.secondLanguage);
      setStatus("Script bilingue généré.");
    } catch {
      setStatus("Service IA prêt à connecter au backend StoryCraft.");
    }
  }

  async function handleImageGeneration() {
    setActiveStep(2);
    setIsImageLoading(true);
    setStatus("Préparation des prompts visuels cohérents...");
    try {
      const result = await generateConsistentVisuals(form.scene, form.characterRef);
      const imageUrl = extractImageUrl(result);

      if (imageUrl) {
        setPreviewImageUrl(imageUrl);
        setStatus("Image générée et injectée dans l'aperçu.");
      } else {
        setStatus("Réponse IA reçue, mais aucune image exploitable n'a été trouvée.");
      }
    } catch {
      setStatus("Pipeline images prêt pour DALL-E 3 via backend sécurisé.");
    } finally {
      setIsImageLoading(false);
    }
  }

  function speakPreviewText(text, language) {
    if (!("speechSynthesis" in window)) {
      setStatus("La lecture audio n'est pas supportée par ce navigateur.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getSpeechLanguageCode(language);
    utterance.rate = 0.92;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  async function handlePremiumPdfExport() {
    if (!bookPreviewRef.current) {
      setStatus("Aucun aperçu disponible pour l'export PDF.");
      return;
    }

    setActiveStep(3);
    setIsExporting(true);
    setStatus("Préparation du PDF A5 premium...");

    try {
      await document.fonts?.ready;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a5"
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const cover = createPdfCoverElement(form.title, form.language, form.secondLanguage);
      document.body.appendChild(cover);
      const coverCanvas = await capturePdfElement(cover);
      document.body.removeChild(cover);
      addCanvasToPdfPage(pdf, coverCanvas, pageWidth, pageHeight);

      pdf.addPage("a5", "portrait");
      const previewCanvas = await capturePdfElement(bookPreviewRef.current);
      addCanvasToPdfPage(pdf, previewCanvas, pageWidth, pageHeight);

      pdf.save(`${slugify(form.title)}-storybook-a5.pdf`);
      setStatus("PDF Premium A5 exporté avec couverture.");
    } catch (error) {
      setStatus("Export PDF indisponible pour le moment. Vérifiez l'image et réessayez.");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleSaveStorybook() {
    setIsSaving(true);
    setStatus("Sauvegarde du livre en cours...");

    try {
      const storybookId = await saveStorybookDraft("demo-user", {
        title: form.title,
        theme: form.theme,
        visualStyle: form.style,
        language: form.language,
        secondLanguage: form.secondLanguage,
        characterRef: form.characterRef,
        scene: form.scene,
        previewImageUrl,
        pages: [
          {
            order: 1,
            text: primaryPreviewText,
            translatedText: secondaryPreviewText
          }
        ]
      });

      setStatus(`Livre sauvegardé dans Firebase. ID: ${storybookId}`);
    } catch {
      setStatus("Firebase n'est pas encore configuré. Ajoutez les variables VITE_FIREBASE_*.");
    } finally {
      setIsSaving(false);
    }
  }

  const primaryPreviewText =
    "Awa découvre une graine lumineuse et apprend que les histoires grandissent quand les enfants les partagent.";
  const secondaryPreviewText =
    "Awa discovers a glowing seed and learns that stories grow when children share them.";

  return (
    <section id="studio" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-neon">{t("workspace")}</p>
          <h2 className="mt-4 font-book text-4xl font-bold text-white md:text-5xl">
            {t("dashboardTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-zinc-400">{t("dashboardSubtitle")}</p>
        </div>
        <button
          onClick={handlePremiumPdfExport}
          disabled={isExporting}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-neon px-5 py-3 font-extrabold text-zinc-950 shadow-neon transition hover:bg-emerald-300"
        >
          {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
          {isExporting ? "Export en cours..." : t("exportPdf")}
        </button>
      </div>

      <div className="mb-8 rounded-lg border border-white/10 bg-zinc-950/70 p-5">
        <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-neon transition-all" style={{ width: progressWidth }} />
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= activeStep;

            return (
              <button
                key={step.label}
                onClick={() => setActiveStep(index)}
                className={`flex min-h-16 items-center gap-3 rounded-lg border px-4 text-left transition ${
                  isActive
                    ? "border-neon/60 bg-neon/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-zinc-500"
                }`}
              >
                <Icon className={isActive ? "text-neon" : "text-zinc-500"} size={20} />
                <span className="text-sm font-bold">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-white/10 bg-zinc-950/74 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t("bookTitle")}>
              <input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="field-control"
              />
            </Field>
            <Field label={t("visualStyle")}>
              <select
                value={form.style}
                onChange={(event) => updateField("style", event.target.value)}
                className="field-control"
              >
                {visualStyles.map((style) => (
                  <option key={style} className="bg-zinc-950">
                    {style}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("storybookLanguage")}>
              <select
                value={form.language}
                onChange={(event) => updateField("language", event.target.value)}
                className="field-control"
              >
                {storybookLanguages.map((language) => (
                  <option key={language} className="bg-zinc-950">
                    {language}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("targetLanguage")}>
              <select
                value={form.secondLanguage}
                onChange={(event) => updateField("secondLanguage", event.target.value)}
                className="field-control"
              >
                {storybookLanguages.map((language) => (
                  <option key={language} className="bg-zinc-950">
                    {language}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("theme")} wide>
              <input
                value={form.theme}
                onChange={(event) => updateField("theme", event.target.value)}
                className="field-control"
              />
            </Field>
            <Field label={t("characterRef")} wide>
              <textarea
                value={form.characterRef}
                onChange={(event) => updateField("characterRef", event.target.value)}
                className="field-control min-h-24 resize-none"
              />
            </Field>
            <Field label={t("scene")} wide>
              <textarea
                value={form.scene}
                onChange={(event) => updateField("scene", event.target.value)}
                className="field-control min-h-24 resize-none"
              />
            </Field>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleScriptGeneration}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-neon/60 bg-neon px-4 py-3 font-extrabold text-zinc-950 transition hover:bg-emerald-300"
            >
              <Languages size={18} />
              {t("generateScript")}
            </button>
            <button
              onClick={handleImageGeneration}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 px-4 py-3 font-extrabold text-white transition hover:border-neon/60"
            >
              <WandSparkles size={18} />
              {t("generateImages")}
            </button>
          </div>
          <button
            type="button"
            onClick={handleSaveStorybook}
            disabled={isSaving}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 px-4 py-3 font-extrabold text-white transition hover:border-neon/60 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaving ? "Sauvegarde..." : "Sauvegarder le livre"}
          </button>
          {activeStep === 3 ? (
            <div className="mt-5 rounded-lg border border-neon/40 bg-neon/10 p-4">
              <p className="text-sm font-bold text-white">Export PDF Premium</p>
              <p className="mt-1 text-sm text-zinc-300">
                Génère un livre A5 avec couverture automatique et capture de l'aperçu en rendu premium.
              </p>
              <button
                type="button"
                onClick={handlePremiumPdfExport}
                disabled={isExporting}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neon px-4 py-3 font-extrabold text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                {isExporting ? "Export en cours..." : "Exporter en PDF Premium"}
              </button>
            </div>
          ) : null}
          <p className="mt-4 text-sm font-semibold text-neon">{status}</p>
        </div>

        <aside className="rounded-lg border border-white/10 bg-[#f7f1e7] p-6 text-zinc-950">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">
            {t("previewTitle")}
          </p>
          <div ref={bookPreviewRef} className="mt-6 rounded-lg border border-zinc-300 bg-[#fffaf0] p-7 shadow-2xl">
            <h3 className="font-book text-4xl font-bold leading-tight text-zinc-950">{form.title}</h3>
            <p className="mt-2 text-sm font-semibold text-emerald-800">{t("premiumRender")}</p>
            <div className="mt-8 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-gradient-to-br from-emerald-100 via-amber-50 to-sky-100">
              {isImageLoading ? (
                <div className="flex flex-col items-center gap-3 text-emerald-800">
                  <Loader2 className="animate-spin" size={34} />
                  <span className="text-sm font-bold">Génération de l'image...</span>
                </div>
              ) : previewImageUrl ? (
                <img
                  src={previewImageUrl}
                  alt={`Illustration générée pour ${form.title}`}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <PreviewText
                language={form.language}
                text={primaryPreviewText}
                onSpeak={() => speakPreviewText(primaryPreviewText, form.language)}
              />
              <PreviewText
                language={form.secondLanguage}
                text={secondaryPreviewText}
                muted
                onSpeak={() => speakPreviewText(secondaryPreviewText, form.secondLanguage)}
              />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({ label, children, wide = false }) {
  return (
    <label className={`block ${wide ? "md:col-span-2" : ""}`}>
      <span className="mb-2 block text-sm font-bold text-zinc-300">{label}</span>
      {children}
    </label>
  );
}

function PreviewText({ language, text, onSpeak, muted = false }) {
  return (
    <div className="flex items-start gap-3">
      <p
        lang={getHtmlLanguageCode(language)}
        dir="auto"
        className={`min-w-0 flex-1 whitespace-pre-wrap break-words font-book text-xl leading-7 ${
          muted ? "text-zinc-700" : "text-zinc-950"
        }`}
      >
        {text}
      </p>
      <button
        type="button"
        onClick={onSpeak}
        aria-label={`Haut-parleur ${language}`}
        title={`Haut-parleur ${language}`}
        className="no-print-pdf mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-700/30 bg-emerald-50 text-emerald-800 transition hover:bg-emerald-100"
      >
        <Volume2 size={17} />
      </button>
    </div>
  );
}

function extractImageUrl(result) {
  if (!result) {
    return "";
  }

  if (typeof result === "string") {
    return result;
  }

  if (result.imageUrl || result.url) {
    return result.imageUrl ?? result.url;
  }

  const image = result.image ?? result.images?.[0] ?? result.data?.[0];
  if (!image) {
    return "";
  }

  if (typeof image === "string") {
    return image;
  }

  if (image.url || image.imageUrl) {
    return image.url ?? image.imageUrl;
  }

  if (image.b64_json) {
    return `data:image/png;base64,${image.b64_json}`;
  }

  return "";
}

function getHtmlLanguageCode(language) {
  const languageCodes = {
    Français: "fr",
    Anglais: "en",
    Wolof: "wo",
    Lingala: "ln",
    Bambara: "bm",
    Swahili: "sw",
    Fon: "fon",
    Éwé: "ee",
    Mina: "guw"
  };

  return languageCodes[language] ?? "und";
}

function getSpeechLanguageCode(language) {
  const speechCodes = {
    Français: "fr-FR",
    Anglais: "en-US",
    Wolof: "wo-SN",
    Lingala: "ln-CD",
    Bambara: "bm-ML",
    Swahili: "sw-TZ",
    Fon: "fon-BJ",
    Éwé: "ee-TG",
    Mina: "guw-TG"
  };

  return speechCodes[language] ?? getHtmlLanguageCode(language);
}

async function capturePdfElement(element) {
  return html2canvas(element, {
    backgroundColor: "#fffaf0",
    scale: 2.4,
    useCORS: true,
    allowTaint: false,
    ignoreElements: (node) => node.classList?.contains("no-print-pdf")
  });
}

function addCanvasToPdfPage(pdf, canvas, pageWidth, pageHeight) {
  const imageData = canvas.toDataURL("image/png", 1);
  const imageRatio = canvas.width / canvas.height;
  const pageRatio = pageWidth / pageHeight;
  const width = imageRatio > pageRatio ? pageWidth : pageHeight * imageRatio;
  const height = imageRatio > pageRatio ? pageWidth / imageRatio : pageHeight;
  const x = (pageWidth - width) / 2;
  const y = (pageHeight - height) / 2;

  pdf.addImage(imageData, "PNG", x, y, width, height, undefined, "FAST");
}

function createPdfCoverElement(title, lang1, lang2) {
  const cover = document.createElement("section");
  cover.style.position = "fixed";
  cover.style.left = "-10000px";
  cover.style.top = "0";
  cover.style.width = "794px";
  cover.style.height = "1123px";
  cover.style.boxSizing = "border-box";
  cover.style.padding = "92px 70px";
  cover.style.background = "linear-gradient(145deg, #fffaf0 0%, #f4ead8 54%, #dff7e8 100%)";
  cover.style.color = "#111827";
  cover.style.fontFamily = '"Crimson Text", Georgia, serif';
  cover.style.display = "flex";
  cover.style.flexDirection = "column";
  cover.style.justifyContent = "space-between";
  cover.style.border = "1px solid #e5dccb";

  cover.innerHTML = `
    <div style="font-family: Inter, system-ui, sans-serif; font-size: 18px; font-weight: 800; letter-spacing: 0.28em; color: #047857; text-transform: uppercase;">
      StoryCraft AI
    </div>
    <div>
      <h1 style="margin: 0; font-size: 76px; line-height: 0.95; font-weight: 700;">${escapeHtml(title)}</h1>
      <p style="margin: 28px 0 0; font-family: Inter, system-ui, sans-serif; font-size: 22px; font-weight: 700; color: #047857;">
        Storybook bilingue ${escapeHtml(lang1)} / ${escapeHtml(lang2)}
      </p>
    </div>
    <div style="height: 330px; border-radius: 22px; border: 1px solid #d8cdb9; background: linear-gradient(135deg, #dcfce7 0%, #fef3c7 52%, #dbeafe 100%);"></div>
    <div style="font-family: Inter, system-ui, sans-serif; font-size: 18px; font-weight: 800; color: #111827;">
      Edition Premium A5
    </div>
  `;

  return cover;
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "storycraft";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
