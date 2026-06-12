const nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse JSON body
    let body = req.body;
    
    // If body is a string, parse it
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const { name, email, description, attachment } = body;

    console.log("📥 Received report:", { name, email, description: description?.substring(0, 50) });

    // Validation
    if (!description || description.trim().length === 0) {
      return res.status(400).json({ error: "Description is required" });
    }

    if (description.length > 2000) {
      return res.status(400).json({ error: "Description cannot exceed 2000 characters" });
    }

    // Email validation if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
    }

    // Configure email transporter
    let transporter;

    console.log("🔑 GMAIL_APP_PASSWORD exists:", !!process.env.GMAIL_APP_PASSWORD);

    if (!process.env.GMAIL_APP_PASSWORD) {
      console.log("🧪 Using Ethereal for development email testing");
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
      console.log("📧 Using Gmail for production");
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER || "phool8790@gmail.com",
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
    }

    // Prepare attachments (base64 encoded from frontend)
    const attachments = [];
    if (attachment && attachment.data && attachment.filename) {
      try {
        // attachment.data is base64 string
        const bufferData = Buffer.from(attachment.data, "base64");
        attachments.push({
          filename: attachment.filename,
          content: bufferData,
        });
        console.log("📎 Attachment prepared:", attachment.filename);
      } catch (e) {
        console.error("⚠️ Error processing attachment:", e.message);
        // Continue without attachment
      }
    }

    // Email to admin
    const adminMailOptions = {
      from: '"Bug Report System" <noreply@pratap.com>',
      to: "phool8790@gmail.com",
      subject: "🐛 New Bug Report Submitted",
      html: `
        <h2>New Bug Report Received</h2>
        <hr/>
        <p><strong>Reporter Name:</strong> ${name || "Anonymous"}</p>
        <p><strong>Reporter Email:</strong> ${email || "Not provided"}</p>
        <hr/>
        <h3>Description:</h3>
        <p style="white-space: pre-wrap; word-wrap: break-word; background-color: #f5f5f5; padding: 12px; border-radius: 4px;">
          ${description}
        </p>
        <hr/>
        <p style="font-size: 12px; color: #999;">
          Submitted on: ${new Date().toLocaleString()}
        </p>
      `,
      attachments: attachments,
    };

    // Send admin email
    console.log("📬 Sending bug report to admin...");
    const adminInfo = await transporter.sendMail(adminMailOptions);
    console.log("✅ Admin notification sent:", adminInfo.messageId);

    res.status(200).json({
      success: true,
      message: "Thank you for your report! We have received it and will review it shortly.",
    });
  } catch (err) {
    console.error("❌ Bug report error:", err.message);
    console.error("❌ Full error stack:", err.stack);

    res.status(500).json({
      error: "Failed to submit report. Please try again later.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
