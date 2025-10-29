import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Use the same format as your sample
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a alice, an assistant." },
        { role: "user", content: message }
      ],
      model: "deepseek-chat",
    });

    const reply = completion.choices[0].message.content;
    console.log("Reply:", reply); // logs in Vercel dev terminal
    res.status(200).json({ reply });

  } catch (err) {
    console.error("DeepSeek API error:", err);
    res.status(500).json({ error: "DeepSeek API call failed", details: err.message });
  }
}
