import { GoogleGenerativeAI } from "@google/generative-ai"; // Note the correct package name

const apiKey = process.env.GEMINI_API_KEY;

// Initialize the GoogleGenerativeAI client
const genAI = new GoogleGenerativeAI(apiKey); // Correct initialization

export const chatWithGemini = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    console.log("Sending request to Gemini API with message:", message);

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use "gemini-pro" or "gemini-1.5-flash"

    // Generate content
    const result = await model.generateContent(message); // Simplified for single-turn conversations
    const response = await result.response;
    const text = response.text();

    console.log("Gemini API response:", text);
    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      error: "Failed to get response from Gemini API",
      details: error.message 
    });
  }
};