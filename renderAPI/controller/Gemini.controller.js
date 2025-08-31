import googleGenAi from "../utils/Gemini.js";

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