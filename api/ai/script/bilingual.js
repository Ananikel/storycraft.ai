import OpenAI from "openai";

function buildPrompt(body) {
  const {
    theme,
    title,
    visualStyle,
    lang1,
    lang2,
    characterRef,
    scene,
    promptInstructions = []
  } = body;

  const languageRules = getLanguageRules(lang1, lang2);

  return `
Create a short bilingual children's storybook script.

Book title: ${title || "Untitled storybook"}
Theme: ${theme}
Visual style: ${visualStyle || "Premium illustrated children's book"}
Primary language: ${lang1}
Second language: ${lang2}
Character reference: ${characterRef || "Not provided"}
Opening scene: ${scene || "Not provided"}

Requirements:
- Return JSON only, no markdown.
- JSON shape: {"title":"string","pages":[{"page":1,"text1":"string","text2":"string","imagePrompt":"string"}]}
- Create exactly 4 pages for this test version.
- Each page text must be 1 to 2 short sentences per language.
- Keep the story appropriate for children around 6 to 10 years old.
- Make the story concrete, warm, educational, and easy to read aloud.
- Keep text1 in ${lang1} and text2 in ${lang2}.
- Do not translate text2 into English unless the selected second language is English.
- If the second language is Éwé/Ewe, every text2 value must be in Éwé only, not English.
- If you cannot provide perfect Éwé, produce simple natural Éwé sentences with correct Unicode characters rather than falling back to English.
- Preserve UTF-8 characters and correct orthography for local languages.
- Use the exact language pair requested by the user: ${lang1} / ${lang2}.
- The imagePrompt must describe a consistent illustrated scene for that page.

Language-specific rules:
${languageRules.map((item) => `- ${item}`).join("\n")}

Additional cultural and orthography instructions:
${promptInstructions.map((item) => `- ${item}`).join("\n")}
`.trim();
}

function getLanguageRules(lang1, lang2) {
  const selected = [lang1, lang2].join(" ").toLowerCase();
  const rules = [];

  if (selected.includes("éwé") || selected.includes("ewe")) {
    rules.push("Éwé/Ewe must use Ewe orthography and may include characters such as ƒ, ɖ, ŋ, ɔ, ɛ, ʋ, ɣ when linguistically appropriate.");
    rules.push("Avoid English words in Éwé text except unavoidable modern loanwords. Prefer short child-friendly Éwé sentences.");
    rules.push("Example style only, do not copy verbatim: Koffi kpɔ kɔmpiuta la. Eƒe dzi dzɔ ale gbegbe.");
  }

  if (selected.includes("mina")) {
    rules.push("Mina/Gen text must preserve local orthography, nasalization, open vowels such as ɔ and ɛ, and tone marks when appropriate.");
    rules.push("Avoid English fallback in Mina/Gen text.");
  }

  return rules;
}

function parseJsonOutput(outputText) {
  const jsonMatch = outputText.match(/\{[\s\S]*\}/);
  const rawJson = jsonMatch ? jsonMatch[0] : outputText;
  const cleaned = outputText
    ? rawJson
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim()
    : "";

  return JSON.parse(cleaned);
}

function textLooksLikeWrongLanguage(text, targetLanguage) {
  const target = String(targetLanguage || "").toLowerCase();
  if (!(target.includes("éwé") || target.includes("ewe") || target.includes("mina"))) {
    return false;
  }

  const englishSignals = /\b(the|and|learns|discovers|story|computer|keyboard|children|shares|smile|first)\b/i;
  return englishSignals.test(text);
}

async function createStorybook(client, model, body) {
  const result = await client.responses.create({
    model,
    input: buildPrompt(body),
    max_output_tokens: 1600
  });

  const storybook = parseJsonOutput(result.output_text || "");
  if (!storybook.pages?.length) {
    throw new Error("OpenAI returned an empty storybook.");
  }

  const wrongLanguagePage = storybook.pages.find((page) =>
    textLooksLikeWrongLanguage(page.text2, body.lang2)
  );
  if (wrongLanguagePage) {
    throw new Error(`Generated text2 is not in the requested target language: ${body.lang2}`);
  }

  return storybook;
}

export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.setHeader("Allow", "POST, OPTIONS");
    return response.status(204).end();
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST, OPTIONS");
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(500).json({ error: "Missing OPENAI_API_KEY" });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const preferredModel = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const fallbackModel = "gpt-4o-mini";

  try {
    const storybook = await createStorybook(client, preferredModel, request.body ?? {});
    return response.status(200).json(storybook);
  } catch (error) {
    if (preferredModel !== fallbackModel) {
      try {
        const storybook = await createStorybook(client, fallbackModel, request.body ?? {});
        return response.status(200).json(storybook);
      } catch (fallbackError) {
        return response.status(500).json({
          error: "Unable to generate bilingual script.",
          detail: fallbackError.message,
          firstAttempt: error.message
        });
      }
    }

    return response.status(500).json({
      error: "Unable to generate bilingual script.",
      detail: error.message
    });
  }
}
