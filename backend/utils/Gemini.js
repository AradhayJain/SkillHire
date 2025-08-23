
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDy2dYTvbAcdqkbsO7t-nJCMaLiIYlTdO0" }); // Use environment variable for safety

async function googleGenAi(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0,   // 🔑 ensures consistent output
    },
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  });

  // Inspect the response structure to get the generated text
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  try {
    let cleanText = text.trim();
  
    // Remove ```json or ``` wrappers if present
    cleanText = cleanText.replace(/^```json\s*/i, "").replace(/```$/i, "");
  
    return JSON.parse(cleanText);
  } catch (err) {
    console.error("⚠️ Failed to parse AI response as JSON:", err);
    return { rawText: text }; // fallback
  }
}

export default googleGenAi;
