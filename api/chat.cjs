// api/chat.cjs
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = async (req, res) => {
  try {
    const pdfPath = path.join(process.cwd(), "public", "pratapInfo.pdf");
    console.log("🟡 PDF path:", pdfPath);

    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text.substring(0, 2000);

    const { message } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log("🔑 Using OpenRouter Key:", apiKey ? "✅ Found" : "❌ Missing");

    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENROUTER_API_KEY" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [
          {
            role: "system",
            content: `Answer strictly using this PDF content:\n\n${pdfText}`,
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    console.log("🔹 OpenRouter raw:", data);

    if (!response.ok) {
      console.error("❌ OpenRouter API Error:", data);
      return res.status(400).json({ error: data.error?.message || "OpenRouter request failed" });
    }

    const reply = data?.choices?.[0]?.message?.content || "No valid response.";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Chat API error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
