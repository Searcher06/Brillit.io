import dotenv from "dotenv";
import { userModel } from "../models/user.model.js";
import { GoogleGenAI, Type } from "@google/genai";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const videoSuggestion = async (req, res) => {
  try {
    // getting the current user
    const user = await userModel.findById(req.user._id);

    const videosWatched = user.videosWatched;
    const currentUserInterest = user.suggestedKeywords;

    // The Model system instructions
    const adaptiveSystemInstructions = `
You are an intelligent educational keyword refinement system for Brillit — a platform that recommends personalized learning content to students.

Your job is to analyze:
- A list of recently watched educational video titles by the user
- Previously generated keywords related to their learning goals

Then, based on that data, return a refined JSON array of **highly relevant, educational search keywords** that reflect the user's current learning path.

Only return a raw JSON array of keyword strings. Do NOT include any explanations or formatting.

Each keyword must be:
- 1 to 3 words max
- Closely related to education, science, technology, productivity, or personal development
- Optimized for video search engines (e.g., "Python Loops", "Stoichiometry", "Newton’s Laws", "React Props")

Rules:
- If the user has watched a lot of content on a specific subject, prioritize that subject in the keywords
- Blend previous keywords with trends in recent activity to reflect changing interests
- Avoid duplicates or near-duplicates

If the video titles or keywords are vague, empty, or non-educational:
- Return a safe list of **popular default educational topics** (e.g., "Critical Thinking", "JavaScript", "Time Management", "Basic Math")

Do NOT include:
- Sentences
- Quotes
- Comments
- Labels like “Keywords:”

Constraints:
- Minimum of 10 keywords
- Maximum of 15 keywords

Final output must ONLY be a **valid JSON array** of updated educational keywords.
`;
    // Customizing the full prompt
    const fullPrompt = `${adaptiveSystemInstructions}\n\nVideos Watched:${videosWatched.toString()}\n\nCurrent User interest:${currentUserInterest.toString()}`;

    // Getting the Model response
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
    }
    user.save();
    res.status(200).json({ keywords });
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
};
