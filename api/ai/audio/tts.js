import OpenAI from "openai";

function buildVoiceInstructions(language) {
  if (language === "Français") {
    return "Read in clear, warm, slow French suitable for children. Use a natural classroom storytelling tone.";
  }

  if (language === "Éwé") {
    return "Read the text carefully and slowly. Preserve Ewe words and Unicode characters. Use a warm storytelling tone for children.";
  }

  if (language === "Mina") {
    return "Read the text carefully and slowly. Preserve Mina/Gen words and Unicode characters. Use a warm storytelling tone for children.";
  }

  return "Read clearly and warmly, with a calm children's storybook narration style.";
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

  const { text, language } = request.body ?? {};
  if (!text) {
    return response.status(400).json({ error: "Missing text" });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const audio = await client.audio.speech.create({
      model: process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts",
      voice: process.env.OPENAI_TTS_VOICE || "marin",
      input: text,
      instructions: buildVoiceInstructions(language),
      response_format: "mp3"
    });

    const buffer = Buffer.from(await audio.arrayBuffer());
    response.setHeader("Content-Type", "audio/mpeg");
    response.setHeader("Cache-Control", "no-store");
    return response.status(200).send(buffer);
  } catch (error) {
    return response.status(500).json({
      error: "Unable to generate speech.",
      detail: error.message
    });
  }
}
