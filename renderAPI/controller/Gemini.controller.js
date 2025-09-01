import googleGenAi from "../utils/Gemini.js";
import {generateAIResponse} from "../utils/Gem.js";

export const getGeminiResponse = async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log(prompt)
        if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
        }
    
        // Call your Gemini AI function here
        const aiResponse = await googleGenAi(prompt);

        console.log(aiResponse)
    
        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Error in getGeminiResponse:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getGem = async (req, res) => {
    try {
        // const testPrompt = "Provide a brief summary of the benefits of using AI in modern applications.";
        const {prompt} = req.body;
    
        // Call your Gemini AI function here
        const aiResponse = await generateAIResponse(prompt);
    
        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Error in getGeminiTest:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}