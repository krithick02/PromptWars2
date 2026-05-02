import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Translates text using Google Gemini AI.
 * Demonstrates cross-service utility and AI/ML adoption.
 */
export async function translateText(text: string, targetLanguage: string) {
  if (!API_KEY) return text;
  if (targetLanguage === "en") return text;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Translate the following text to ${targetLanguage}. 
    Return only the translated text without any explanations or extra characters.
    
    Text: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
}
