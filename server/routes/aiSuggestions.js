import { Router } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

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

        // ✨ System Instructions (merged into prompt)
        const systemInstructions = `
You are an intelligent educational recommendation system built for Brillit — a platform that helps students discover personalized learning videos.

Your job is to analyze a new user's goals, interests, and favorite subjects, and generate a short, powerful list of highly relevant searchable topics or keywords that reflect what the user wants to learn.

Only return a JSON array of keyword strings. Do not explain anything.

Each keyword should be:
- Short and clear (1 to 3 words max)
- Related to education, tech, science, or self-improvement
- Optimized for video search (e.g., "React", "Differentiation", "Trigonometry", "Big Bang Theory", "Mail Merge")

Do NOT include:
- Sentences
- Explanations
- Quotes
- Words like "Keywords:", "Here is", or any formatting. Only a raw JSON array.
`;

        const fullPrompt = `${systemInstructions}\n\nUser Info: ${message}`;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [{ text: fullPrompt }],
                },
            ],
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                },
            },
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.log('Full Gemini response:', JSON.stringify(response, null, 2));
            return res.status(500).json({ error: 'Gemini gave no usable text' });
        }

        // Parse and send JSON array
        const keywords = JSON.parse(text);
        res.status(200).json({ keywords });
    } catch (error) {
        console.error('Gemini error:', error);
        res.status(500).json({ error: 'Something went wrong with Gemini' });
    }
});

export default router;
