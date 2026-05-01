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
- Preserve UTF-8 characters and correct orthography for local languages.
- If ${lang2} is Éwé or Mina, use correct special characters when appropriate and avoid replacing them with plain ASCII.
- The imagePrompt must describe a consistent illustrated scene for that page.

Additional cultural and orthography instructions:
${promptInstructions.map((item) => `- ${item}`).join("\n")}
`.trim();
}

function parseJsonOutput(outputText) {
  const cleaned = outputText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned);
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
  const model = process.env.OPENAI_MODEL || "gpt-5.2";

  try {
    const result = await client.responses.create({
      model,
      input: buildPrompt(request.body ?? {}),
      max_output_tokens: 1400
    });

    const storybook = parseJsonOutput(result.output_text);
    return response.status(200).json(storybook);
  } catch (error) {
    return response.status(500).json({
      error: "Unable to generate bilingual script.",
      detail: error.message
    });
  }
}
