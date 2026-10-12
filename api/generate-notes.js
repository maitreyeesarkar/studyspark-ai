import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Use POST.",
    });
  }

  try {
    const { text } = req.body ?? {};

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        error: "Please provide study material.",
      });
    }

    if (text.length > 50000) {
      return res.status(413).json({
        error: "Study material is too long. Please use fewer than 50,000 characters.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `You are StudySpark AI, an educational assistant.

Create clear, accurate study notes from the material provided below.

Use this structure:
1. Topic title
2. Short summary
3. Important key points
4. Important definitions
5. Exam preparation points

Use simple language and organize the notes with headings and bullet points.
Do not invent facts that are not supported by the supplied material.
If the material is insufficient, mention that clearly.

Study material:
${text}`,
    });

    return res.status(200).json({
      notes: response.text,
    });
  } catch (error) {
    console.error("Gemini API error:", error.message);

    return res.status(500).json({
      error: "Unable to generate notes right now. Please try again.",
    });
  }
}