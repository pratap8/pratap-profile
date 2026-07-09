const nodemailer = require("nodemailer");

const DEFAULT_EMAIL = "phool8790@gmail.com";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const name = body?.name?.trim();
    const message = body?.message?.trim();

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let transporter;

    if (!process.env.GMAIL_APP_PASSWORD) {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER || DEFAULT_EMAIL,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
    }

    const mailOptions = {
      from: '"Feedback / Suggestion" <noreply@pratap.com>',
      to: DEFAULT_EMAIL,
      subject: "New Feedback / Suggestion",
      html: `
        <h2>New Feedback / Suggestion</h2>
        <p><strong>Name:</strong> ${name || "Not provided"}</p>
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
        <div style="white-space: pre-wrap; background: #f7f7f7; padding: 12px; border-radius: 6px;">
          ${escapeHtml(message)}
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    const response = {
      success: true,
      message: "Thanks! Your suggestion has been sent.",
    };

    if (!process.env.GMAIL_APP_PASSWORD) {
      response.previewUrl = nodemailer.getTestMessageUrl(info);
    }

    return res.status(200).json(response);
  } catch (err) {
    console.error("send-feedback error:", err);
    return res.status(500).json({ error: "Failed to send feedback. Please try again later." });
  }
};
