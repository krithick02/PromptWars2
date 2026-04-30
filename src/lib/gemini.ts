import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function askCivicConcierge(question: string) {
  if (!API_KEY) {
    return "Intelligence module is not configured. Please add an API key.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a helpful Civic Education Concierge for a US Election Dashboard. 
    Answer the following question clearly and concisely for a voter. 
    If the question is not about voting, elections, or civic processes, politely say you only answer civic-related questions.
    
    Question: ${question}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the intelligence module. Please try again later.";
  }
}
