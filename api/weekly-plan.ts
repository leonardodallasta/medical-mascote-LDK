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
      contents: `Gere um cardápio semanal simples (Domingo a Sábado) de lanches para proteger o estômago ao tomar remédio.
      REGRAS IMPORTANTES:
      1. Nunca sugira alimentos secos sozinhos.
      2. Alimentos brasileiros comuns e baratos.
      
      Retorne APENAS um JSON array válido.
      Formato: [{"day": "Domingo", "food": "Alimento"}]`
    });

    let jsonStr = response.text || "";
    jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();

    return res.status(200).json(JSON.parse(jsonStr));
  } catch (error) {
    console.error("Weekly plan error:", error);
    return res.status(500).json({ error: "Failed to generate plan" });
  }
}
