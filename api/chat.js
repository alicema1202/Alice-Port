import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com/", // ✅ correct base
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export default async function handler(req, res) {
  // --- CORS setup ---
  const allowedOrigins = [
    "http://localhost:3001",
    "https://alice-port-git-main-alice-mas-projects-97d189e8.vercel.app",
    "https://alicemadesign.com",
    "https://www.alicemadesign.com",
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    // For server-to-server calls or non-browser requests
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // --- End CORS setup ---

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  console.log("📩 Incoming message:", message);
  console.log("🔑 API key loaded:", !!process.env.DEEPSEEK_API_KEY);

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || "(no reply)";
    console.log("🤖 Reply:", reply);

    res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ DeepSeek API Error:", err);
    res.status(500).json({
      error: "DeepSeek API call failed",
      details: err.message || "Unknown error",
    });
  }
}
