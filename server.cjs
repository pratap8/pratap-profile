// ✅ Load environment variables from .env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const pdfParse = require("pdf-parse");
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

let cachedText = "";

// ✅ Load PDF when the server starts
async function loadPdf() {
  try {
    const filePath = path.join(process.cwd(), "public", "pratapInfo.pdf");
    const data = await fs.readFile(filePath);

    const pdf = await pdfParse(data);
    cachedText = pdf.text.replace(/\s+/g, " ").trim();

    console.log("✅ PDF loaded successfully!");
  } catch (err) {
    console.error("❌ PDF load failed:", err);
  }
}
loadPdf();

// ✅ AI Chat Endpoint
app.post("/api/chat", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Missing question" });
  }

  try {
    const prompt = `
You must answer ONLY from this resume content.
If the answer is not available in the resume, say:
"I don't know from the document."

RESUME CONTENT:
${cachedText}

QUESTION: ${question}
ANSWER:
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [
          { role: "system", content: "Answer based only on the resume content." },
          { role: "user", content: prompt }
        ],
        max_tokens: 400,
        temperature: 0.2
      })
    });

    const json = await response.json();
    const answer = json?.choices?.[0]?.message?.content || "No valid response.";

    res.json({ answer });
  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start local server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Local API running at http://localhost:${PORT}/api/chat`)
);
