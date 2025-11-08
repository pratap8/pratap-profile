import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";

let cachedText = null;

// ✅ Load PDF at runtime
async function loadPdf() {
  if (cachedText) return cachedText;

  try {
    const pdfPath = path.join(process.cwd(), "public", "pratapInfo.pdf");
    const data = await fs.readFile(pdfPath);
    const pdf = await pdfParse(data);

    cachedText = pdf.text.replace(/\s+/g, " ").trim();

    // optional limit
    if (cachedText.length > 20000) {
      cachedText = cachedText.slice(0, 20000);
    }

    return cachedText;
  } catch (err) {
    console.error("PDF load error:", err);
    throw err;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Missing question" });
  }

  try {
    const text = await loadPdf();

    const prompt = `
Answer ONLY using this resume content.  
If answer not found, say: "I don't know from the document."

RESUME CONTENT:
${text}

QUESTION: ${question}
ANSWER:
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [
          { role: "system", content: "Answer using resume content only." },
          { role: "user", content: prompt }
        ],
        max_tokens: 400,
        temperature: 0.2,
      }),
    });

    const json = await response.json();

    const answer =
      json?.choices?.[0]?.message?.content ||
      json?.error?.message ||
      "No response.";

    return res.status(200).json({ answer });
  } catch (err) {
    console.error("chat.js error:", err);
    return res.status(500).json({ error: err.message });
  }
}
