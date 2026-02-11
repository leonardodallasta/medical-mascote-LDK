import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing Gemini API key" });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents:
        "Dê uma dica curta (máx 15 palavras) sobre um alimento específico para proteger o estômago antes de tomar remédio. Seja direto.",
    });

    const text = response.text?.trim();

    return res.status(200).json({ tip: text });
  } catch (error) {
    console.error("Gemini error:", error);
    return res.status(500).json({ error: "Failed to generate tip" });
  }
}
