import { Router } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const router = Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

router.post('/chat-gemini', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log("Prompt:", message);

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [{ text: message }],
                },
            ],
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.log("Full response:", JSON.stringify(response, null, 2));
            return res.status(500).json({ error: 'Gemini gave no usable text' });
        }

        res.status(200).json({ reply: text });
    } catch (error) {
        console.error('Gemini error:', error);
        res.status(500).json({ error: 'Something went wrong with Gemini' });
    }
});

export default router;
