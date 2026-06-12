const nodemailer = require("nodemailer");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

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
    // Parse form data with file upload
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      maxFields: 10,
    });

    const [fields, files] = await form.parse(req);

    // Extract fields (formidable returns arrays)
    const name = fields.name?.[0] || "";
    const email = fields.email?.[0] || "";
    const description = fields.description?.[0] || "";
    const attachmentFile = files.attachment?.[0];

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

    // Prepare attachments
    const attachments = [];
    if (attachmentFile) {
      const fileBuffer = fs.readFileSync(attachmentFile.filepath);
      attachments.push({
        filename: attachmentFile.originalFilename,
        content: fileBuffer,
      });
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

    // Confirmation email to reporter (if email provided)
    let confirmationMailOptions = null;
    if (email) {
      confirmationMailOptions = {
        from: '"Pratap Portfolio" <noreply@pratap.com>',
        to: email,
        subject: "Thank You - Bug Report Received",
        html: `
          <h2>Thank You for Your Report</h2>
          <p>Hi ${name || "there"},</p>
          <p>We have received your bug report or sensitive information submission. Our team will review it shortly and take appropriate action.</p>
          <hr/>
          <h3>Your Report Summary:</h3>
          <p style="white-space: pre-wrap; word-wrap: break-word; background-color: #f5f5f5; padding: 12px; border-radius: 4px;">
            ${description}
          </p>
          <hr/>
          <p>If you have any urgent concerns, please feel free to reach out directly.</p>
          <br/>
          <p>Best Regards,</p>
          <p><strong>Phool Babu Raj Pratap Singh</strong></p>
          <p>📧 phool8790@gmail.com</p>
          <p>📱 +91-8790565427</p>
        `,
      };
    }

    // Send admin email
    console.log("📬 Sending bug report to admin...");
    await transporter.sendMail(adminMailOptions);
    console.log("✅ Admin notification sent");

    // Send confirmation email if email provided
    if (confirmationMailOptions) {
      console.log("📬 Sending confirmation email to reporter...");
      await transporter.sendMail(confirmationMailOptions);
      console.log("✅ Confirmation email sent");
    }

    // Clean up uploaded file
    if (attachmentFile) {
      try {
        fs.unlinkSync(attachmentFile.filepath);
      } catch (e) {
        console.error("Error deleting temp file:", e);
      }
    }

    res.status(200).json({
      success: true,
      message: "Thank you for your report! We have received it and will review it shortly.",
    });
  } catch (err) {
    console.error("❌ Bug report error:", err.message);
    console.error("❌ Full error:", err);

    res.status(500).json({
      error: "Failed to submit report. Please try again later.",
      details: err.message,
    });
  }
};
