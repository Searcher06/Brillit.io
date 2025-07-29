import { Router } from "express";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import protect from "../middlewares/authMiddlware.js";
import { userModel } from "../models/user.model.js";
import { videoSuggestion } from "../controllers/suggestion.controllers.js";

dotenv.config();

const router = Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

router.post("/suggest", protect, async (req, res) => {
  try {
    // getting the user prompt
    const { message } = req.body;

    // getting the current user
    const user = await userModel.findById(req.user._id);
    // user && console.log(user)

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const systemInstructions = `
You are an intelligent educational recommendation system built for Brillit — a platform that helps students discover personalized learning videos.

Your job is to analyze a new user's goals, interests, or activity history, and generate a short, powerful list of highly relevant, **searchable topics or keywords** that reflect what the user wants to learn.

Only return a raw JSON array of keyword strings. Do NOT return any explanations or formatting.

Each keyword must be:
- Short and clear (1 to 3 words max)
- Strongly related to education, technology, science, productivity, or self-improvement
- Optimized for video search (e.g., "React", "Differentiation", "Trigonometry", "Big Bang Theory", "Mail Merge")

If the input is vague, empty, or contains non-educational content (like music, gossip, or random phrases):
- Still return a JSON array of **default educational topics** that are popular and useful for students (e.g., "Time Management", "Algebra", "Web Development").

Do NOT include:
- Sentences
- Quotes
- Explanations
- Labels like "Here are the keywords:"

NOTE:
- The min keywords is 10
- The max keywords is 15

Final output must only be a valid JSON array of educational keywords.
`;

    const fullPrompt = `${systemInstructions}\n\nUser Info: ${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.log("Full Gemini response:", JSON.stringify(response, null, 2));
      return res.status(500).json({ error: "Gemini gave no usable text" });
    }

    // Parse and send JSON array
    const keywords = JSON.parse(text);
    if (keywords) {
      user.suggestedKeywords = keywords;
      user.isPersonalized = true;
    }
    user.save();
    // const updatedUser = await userModel.findById(user._id)
    res.status(200).json(keywords); //incoming
  } catch (error) {
    console.log(error);
    if (error.status == 503) {
      res
        .status(503)
        .json({ error: "Too many request at the moment try again later" });
      return;
    }

    res.status(500);
    throw new Error("Internal server error");
  }
});

router.post("/videoSuggestion", protect, videoSuggestion);

export default router;
