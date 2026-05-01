import { getApiBaseUrl } from "./apiBaseUrl.js";

const localLanguageGuidance = {
  "Éwé": {
    orthography:
      "Use correct Ewe orthography and Unicode characters, including ƒ, ɖ, ŋ, ɔ, ɛ, ʋ and appropriate tone marks when needed.",
    culture:
      "Respect Ewe cultural nuance from the coastal Gulf of Guinea, especially Togo and Ghana, without flattening it into generic folklore."
  },
  Mina: {
    orthography:
      "Use correct Mina/Gen orthography and Unicode characters, preserving nasalization, open vowels such as ɔ and ɛ, and tone marks when appropriate.",
    culture:
      "Respect Mina/Gen cultural nuance from coastal Togo and Benin, including the urban and coastal context of the Gulf of Guinea."
  }
};

function buildCulturalInstructions(lang1, lang2) {
  const selectedGuidance = [lang1, lang2]
    .map((language) => localLanguageGuidance[language])
    .filter(Boolean);

  return [
    "Write with age-appropriate language for primary school children.",
    "If a target language is Ewe, Mina/Gen, Fon, Wolof, Lingala, Bambara, or Swahili, avoid literal machine-translation phrasing and favor natural, culturally grounded wording.",
    "Respect the cultural nuances of the coastal Gulf of Guinea region, especially family life, school settings, markets, sea breeze, oral storytelling, music, food, and respectful forms of address.",
    "Do not invent sacred rituals, stereotypes, or exoticized details. Keep the tone warm, accurate, and locally respectful.",
    ...selectedGuidance.flatMap((guidance) => [guidance.orthography, guidance.culture])
  ];
}

async function postToAI(endpoint, payload) {
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(errorPayload?.detail || errorPayload?.error || `StoryCraft AI request failed: ${response.status}`);
  }

  return response.json();
}

export async function generateBilingualScript({
  title,
  theme,
  visualStyle,
  lang1,
  lang2,
  characterRef,
  scene
}) {
  return postToAI("/ai/script/bilingual", {
    model: "gpt-5.5",
    title,
    theme,
    visualStyle,
    lang1,
    lang2,
    characterRef,
    scene,
    promptInstructions: buildCulturalInstructions(lang1, lang2),
    output: {
      format: "storybook_script",
      layout: "side_by_side",
      readingLevel: "primary_school",
      pageCount: 12,
      preserveUnicode: true,
      typography: "Use print-safe Unicode text suitable for PDF rendering with Crimson Text or a compatible fallback font."
    }
  });
}

export async function generateConsistentVisuals(sceneDescription, characterRef) {
  return postToAI("/ai/images/consistent-visuals", {
    plannerModel: "gpt-5.5",
    imageModel: "dall-e-3",
    sceneDescription,
    characterRef,
    consistencyInstructions: [
      "Preserve the same character age, facial features, outfit, color palette, and proportions.",
      "When the scene is set in the coastal Gulf of Guinea, reflect the region with respectful, specific visual cues rather than generic African motifs.",
      "Return one refined image prompt per page spread.",
      "Keep a premium illustrated children's book style suitable for print PDF export."
    ]
  });
}

export async function generateSpeechAudio(text, language) {
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}/ai/audio/tts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text, language })
  });

  if (!response.ok) {
    throw new Error(`StoryCraft TTS failed: ${response.status}`);
  }

  return response.blob();
}
