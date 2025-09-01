import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({});
// --- AI Client (Gemini) ---
const genAI = new GoogleGenerativeAI( process.env.GEMINI_API_KEY );
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateAIResponse = async (prompt) => {
    try{
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text;
    }
    catch(err){
        console.error("⚠️ Failed to get AI response:", err);
        return { error: "Failed to get AI response" }; // fallback
    }
}