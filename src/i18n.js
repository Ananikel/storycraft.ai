import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fr: {
    translation: {
      profile: "Mon Profil",
      pricing: "Tarifs",
      workspace: "Studio",
      heroTitle: "StoryCraft AI",
      landingHeroTitle: "Créez des livres pour enfants bilingues en 2 minutes grâce à l'IA",
      heroSubtitle:
        "Créez des livres illustrés multilingues avec scripts bilingues, personnages cohérents et export premium.",
      landingHeroSubtitle:
        "StoryCraft AI transforme vos idées en storybooks illustrés avec support des langues africaines comme l'Éwé, le Mina, le Wolof, le Fon, le Bambara et le Swahili.",
      startProject: "Créer un livre",
      viewPricing: "Voir les offres",
      featuresTitle: "Tout le pipeline créatif, du texte à la voix",
      featuresSubtitle:
        "Pensé pour les créateurs, écoles et éditeurs qui veulent produire vite sans perdre la qualité culturelle et visuelle.",
      visualConsistency: "Cohérence Visuelle IA",
      visualConsistencyCopy:
        "Gardez les mêmes personnages, styles et décors d'une page à l'autre pour un rendu digne d'un livre jeunesse premium.",
      culturalTranslation: "Traduction Culturelle Précise",
      culturalTranslationCopy:
        "Produisez des textes bilingues naturels qui respectent les nuances locales, les caractères spéciaux et les contextes côtiers du Golfe de Guinée.",
      localVoice: "Synthèse Vocale Locale",
      localVoiceCopy:
        "Ajoutez une lecture audio à vos textes pour rendre chaque storybook plus accessible, vivant et utile en classe.",
      plansTitle: "Des plans pensés pour les créateurs d'histoires",
      monthly: "/ mois",
      choose: "Choisir",
      dashboardTitle: "Dashboard de Création",
      dashboardSubtitle: "Composez, générez, illustrez et exportez votre storybook.",
      bookTitle: "Titre",
      visualStyle: "Style visuel",
      storybookLanguage: "Langue du Storybook",
      targetLanguage: "Langue cible",
      theme: "Thème",
      characterRef: "Référence personnage",
      scene: "Description de scène",
      generateScript: "Générer le script",
      generateImages: "Générer les images",
      exportPdf: "Export PDF Premium",
      sideBySide: "Texte bilingue côte-à-côte",
      previewTitle: "Aperçu du livre",
      premiumRender: "Rendu premium avec Crimson Text"
    }
  },
  en: {
    translation: {
      profile: "My Profile",
      pricing: "Pricing",
      workspace: "Studio",
      heroTitle: "StoryCraft AI",
      landingHeroTitle: "Create bilingual children's books in 2 minutes with AI",
      heroSubtitle:
        "Create multilingual illustrated books with bilingual scripts, consistent characters, and premium export.",
      landingHeroSubtitle:
        "StoryCraft AI turns your ideas into illustrated storybooks with support for African languages such as Ewe, Mina, Wolof, Fon, Bambara, and Swahili.",
      startProject: "Create a book",
      viewPricing: "View pricing",
      featuresTitle: "The full creative pipeline, from text to voice",
      featuresSubtitle:
        "Built for creators, schools, and publishers who want speed without losing cultural and visual quality.",
      visualConsistency: "AI Visual Consistency",
      visualConsistencyCopy:
        "Keep the same characters, styles, and environments from page to page for a premium children's book result.",
      culturalTranslation: "Precise Cultural Translation",
      culturalTranslationCopy:
        "Generate natural bilingual text that respects local nuance, special characters, and coastal Gulf of Guinea contexts.",
      localVoice: "Local Voice Synthesis",
      localVoiceCopy:
        "Add read-aloud audio to make each storybook more accessible, lively, and useful in the classroom.",
      plansTitle: "Plans designed for story creators",
      monthly: "/ month",
      choose: "Choose",
      dashboardTitle: "Creation Dashboard",
      dashboardSubtitle: "Compose, generate, illustrate, and export your storybook.",
      bookTitle: "Title",
      visualStyle: "Visual style",
      storybookLanguage: "Storybook language",
      targetLanguage: "Target language",
      theme: "Theme",
      characterRef: "Character reference",
      scene: "Scene description",
      generateScript: "Generate script",
      generateImages: "Generate images",
      exportPdf: "Premium PDF Export",
      sideBySide: "Side-by-side bilingual text",
      previewTitle: "Book preview",
      premiumRender: "Premium render with Crimson Text"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "fr",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
