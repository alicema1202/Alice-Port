import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Parse messages sent from frontend
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // Convert stringified messages back into array
    const messages = JSON.parse(message);

    // DeepSeek API key from environment variable
    const API_KEY = process.env.DEEPSEEK_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: "API key not set in environment" });
    }

    // Call DeepSeek API
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages
      })
    });

    const data = await response.json();

    // Return the DeepSeek response to frontend
    res.status(200).json(data);

  } catch (err) {
    console.error("Error in /api/chat:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
