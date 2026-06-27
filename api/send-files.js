const nodemailer = require("nodemailer");

const DEFAULT_EMAIL = "phool8790@gmail.com";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(req, res) {
  // Allow preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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

    const { name, email, attachments } = body || {};
    const recipientEmail = email && email.trim() ? email.trim() : DEFAULT_EMAIL;

    const senderName = name && name.trim() ? name.trim() : "Anonymous";

    if (email && email.trim() && !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!Array.isArray(attachments) || attachments.length === 0) {
      return res.status(400).json({ error: "At least one file is required" });
    }

    const preparedAttachments = attachments
      .filter((item) => item && item.filename && item.data)
      .map((item) => ({
        filename: item.filename,
        content: Buffer.from(item.data, "base64"),
        contentType: item.contentType || "application/octet-stream",
      }));

    if (preparedAttachments.length === 0) {
      return res.status(400).json({ error: "Could not process attachments" });
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
      from: `"Send Files" <noreply@pratap.com>`,
      to: recipientEmail,
      subject: `Files sent by ${name}`,
      html: `
        <h2>Files submitted from the portfolio</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Recipient:</strong> ${recipientEmail}</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
      `,
      attachments: preparedAttachments,
    };

    const info = await transporter.sendMail(mailOptions);

    const response = {
      success: true,
      message: `Files sent successfully to ${recipientEmail}`,
    };

    if (!process.env.GMAIL_APP_PASSWORD) {
      response.previewUrl = nodemailer.getTestMessageUrl(info);
    }

    return res.status(200).json(response);
  } catch (err) {
    console.error("send-files error:", err);
    return res.status(500).json({ error: "Failed to send files. Please try again later." });
  }
};
