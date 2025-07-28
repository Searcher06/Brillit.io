import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const videoSuggestion = async (req, res) => {
  try {
    const { message } = req.body;

    // getting the current user
    const user = await userModel.findById(req.user._id);

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
  } catch (error) {
    res
      .status(503)
      .json({ error: "Too many request at the moment try again later" });
    return;
  }
};
