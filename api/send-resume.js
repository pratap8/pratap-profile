const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { firstName, email } = req.body;

  // Validation
  if (!firstName || !email) {
    return res.status(400).json({ error: "First name and email are required" });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    let transporter;

    // For development: Use Ethereal (test email service)
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
      // For production: Use Gmail with app password
      console.log("📧 Using Gmail for production");
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER || "phool8790@gmail.com",
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
    }

    console.log("📧 Transporter configured");

    // Path to resume file
    const resumePath = path.join(process.cwd(), "public", "PratapResume.pdf");
    console.log("📄 Resume path:", resumePath);

    // Check if resume file exists
    if (!fs.existsSync(resumePath)) {
      console.error("❌ Resume file not found at:", resumePath);
      return res.status(500).json({ error: "Resume file not found on server" });
    }

    console.log("✅ Resume file found");

    // Email content
    const mailOptions = {
      from: '"Pratap Portfolio" <noreply@pratap.com>',
      to: email,
      subject: "Resume - Phool Babu Raj Pratap Singh",
      html: `
        <h2>Hello ${firstName},</h2>
        <p>Thank you for your interest in my profile!</p>
        <p>Please find my resume attached below.</p>
        <br/>
        <p>Best Regards,</p>
        <p><strong>Phool Babu Raj Pratap Singh</strong></p>
        <p>Java Full Stack Developer</p>
        <p>📧 phool8790@gmail.com</p>
        <p>📱 +91-8790565427</p>
        <p>🔗 <a href="https://www.linkedin.com/in/pbrps/">LinkedIn Profile</a></p>
      `,
      attachments: [
        {
          filename: "PratapResume.pdf",
          path: resumePath,
        },
      ],
    };

    // Send email
    console.log("📬 Sending email to:", email);
    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent successfully to ${email}`);

    // For development with Ethereal: Show the preview URL
    let response = {
      success: true,
      message: `Resume sent successfully to ${email}`,
    };

    if (!process.env.GMAIL_APP_PASSWORD) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("📧 Email Preview URL:", previewUrl);
      response.previewUrl = previewUrl;
      response.message += " (Check email preview in console log)";
    }

    res.status(200).json(response);
  } catch (err) {
    console.error("❌ Email sending error:", err.message);
    console.error("❌ Full error:", err);
    res.status(500).json({
      error: "Failed to send email. Please try again later.",
      details: err.message,
    });
  }
};
