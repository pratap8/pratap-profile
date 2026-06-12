// ✅ Load environment variables from .env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Resume data (same as in api/chat.cjs)
const resumeData = `
PHOOL BABU RAJ PRATAP SINGH
Java Full Stack Developer | Spring Boot | React | MySQL | Microservices
+91-8790565427 | phool8790@gmail.com | LinkedIn:https://www.linkedin.com/in/pbrps/ | Portfolio

PROFESSIONAL SUMMARY
Skilled Java Developer with 4 years' experience in software development activities, seeking a challenging role to make use of my skills to achieve goals of the company. Expert in designing, developing, and optimizing enterprise-level applications. Proficient in full-stack development using Java, Spring Boot, React, and databases. Strong track record in delivering production-grade solutions with focus on code quality, security, and performance optimization.

PROFESSIONAL EXPERIENCE

Deloitte (Hybrid - Hyderabad) - Sep 2025 – Present
Analyst | Client: Verizon
• Currently working as a Java Full-Stack Developer at Verizon, engaged in the design, development, and optimization of enterprise-level applications where we delivered production-grade enterprise solutions.
• Gathering end-to-end requirements and delivering solutions by collaborating closely with business stakeholders and clients in an Agile environment.
• Developing both backend and frontend components using Java, Spring Boot, React, and JSP to build scalable and user-friendly applications.
• Actively involved in defect resolution, debugging, and performance optimization to ensure application stability and reliability.
• Writing robust unit tests using JUnit (Mockito framework), ensuring high code coverage and maintaining application reliability.
• Proficient in database development, including writing complex SQL queries, stored procedures, and performance tuning.
• Implementing and enhancing application security using industry best practices (authentication, secure coding).
• Collaborating closely with cross-functional teams—including QA and DevOps—to ensure smooth integration, code quality, and timely delivery.

Deloitte (Hybrid - Hyderabad) - June 2025 – Sep 2025
Analyst | Client: Confidential
• Performed in-depth technical code reviews and impact analysis across 7 enterprise applications, uncovering more than 5000 impactful issues.
• Identified critical risks such as hard-coded passwords inside codebase, missing WHERE clauses in SQL queries, and absent null checks and many more.
• Delivered insights that enabled leadership to present risks effectively to the client, strengthening trust and positioning Deloitte for future business opportunities.

LTIMindtree (Hybrid - Chennai) - March 2022 – June 2025
Software Engineer | Client: CITI Bank
• Developed executable code and SQL queries based on business requirements, boosting project outcomes by 25%.
• Enhanced user experience by using the Chart.js library to display personalized data through interactive charts.
• Designed and maintained RESTful APIs using Spring Boot, ensuring reliable and scalable architecture.
• Optimized Database performance (SQL queries), resulting in a 30% performance improvement and faster data processing.
• Conducted regular Black Duck scans, reducing vulnerabilities by 30%.
• Performed code analysis with SonarQube, achieving a 35% bug reduction, >90% JUnit coverage with Mockito, and eliminated 100+ code smells using SonarLint.
• Utilized JIRA for comprehensive defect tracking and streamlined issue resolution.

TECHNICAL SKILLS
Languages: Java, JavaScript, JSP, FTL, Chart.js, SQL, React
Technologies/Frameworks: Spring Boot, Spring MVC, Java J2EE, Microservices Frameworks, IBM Liberty Server, MySQL, Oracle SQL, Bootstrap, Tomcat, J-Frog, Jenkins, AJAX
Developer Tools: IntelliJ, GitLab, VS Code, Eclipse, Postman, JIRA, Confluence, Bitbucket, GitHub Copilot

CERTIFICATIONS
Oracle Certified Professional: Java SE 11 Developer
Microsoft Certified: Azure Fundamentals (AZ-900)
Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate

Education
MLR Institute of Technology
Bachelor of Technology - BTech

CGPA: 8.3/10

July 2017 – September 2020

Winner of the IIT Madras I'MPACT Competition (National Level), 2019.
Published a design patent for a Pepper Processing Machine.
Published a research paper titled 'A Review on Theoretical Analysis of a Solar-Powered Thermal System Using Acetone.'
Served as a member of TITA (Telangana Information Technology Association) in two districts: Mulugu and Wanaparthy.
V N R Vignana Jyothi Institute of Engineering & Technology
Diploma

Grade: 84.85%

September 2014 – April 2017

Completed a paid internship at Roctool Engineers Pvt Ltd, gaining hands-on experience in practical engineering applications.
Roctool Engineers Internship

New Brilliant Techno High School
School

CGPA: 7.5/10

Jun 2009 – Mar 2014

Actively participated in outdoor sports, including Cricket and Volleyball.
Secured 1st Place in Chess and 2nd Place in Essay Writing in competitive events.

Publications
• A review on theoretical analysis for solar powered thermal system by using acetone
Published In: AIP Publishing
Date: May 22, 2023
Link: https://pubs.aip.org/aip/acp/article-abstract/2492/1/020068/2891984/A-review-on-theoretical-analysis-for-solar-powered?redirectedFrom=fulltext
• Design Patent of Pepper Processing Machine
Published In: Intellectual Property of India
Date: Aug 6, 2021
Journal No: 32/2021
Link: https://search.ipindia.gov.in/IPOJournal/Journal/Patent

Honors & Awards
I'MPACT || Mechanica 2019
Issued by IIT Madras · Mar 2019
Led the team of five from fund raising till winning the competition.
Won 1st Prize in the I'MPACT National-Level Competition conducted by IIT Madras.
Pitched idea and received funding of ₹50,000 from MLRIT for the project.
Awarded ₹8,000 by IIT Madras for successfully building a functional prototype(Pepper Processing Machine).

EXTRACURRICULAR
• Involved in Corporate Social Responsibility initiatives, educating rural students.
• Member of Telangana Information Technology Association (TITA) since 2019.
`;

// ✅ AI Chat Endpoint
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    console.log("🔑 Using Groq Key:", apiKey ? "✅ Found" : "❌ Missing");

    if (!apiKey) {
      console.error("❌ Missing GROQ_API_KEY");
      return res.status(500).json({ error: "Missing GROQ_API_KEY environment variable" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant representing Phool Babu Raj Pratap Singh, a Java Full Stack Developer. ${resumeData}

Important Instructions:
- Answer questions ONLY based on the resume provided above
- If information is not in the resume, respond with: "I don't have that information in my resume"
- Keep responses concise and professional
- Be friendly and helpful`,
          },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    console.log("🔹 Groq Response Status:", response.status);

    if (!response.ok) {
      console.error("❌ Groq API Error:", data);
      return res.status(400).json({ error: data.error?.message || "Groq API request failed" });
    }

    const reply = data?.choices?.[0]?.message?.content || "No response from AI";
    res.json({ reply });
  } catch (err) {
    console.error("❌ Chat error:", err.message);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});


// ✅ Send Resume via Email Endpoint
app.post("/api/send-resume", async (req, res) => {
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
    const resumePath = path.join(__dirname, "public", "PratapResume.pdf");
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
      message: `Resume sent successfully to ${email}` 
    };
    
    if (!process.env.GMAIL_APP_PASSWORD) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("📧 Email Preview URL:", previewUrl);
      response.previewUrl = previewUrl;
      response.message += " (Check email preview in console log)";
    }

    res.json(response);
  } catch (err) {
    console.error("❌ Email sending error:", err.message);
    console.error("❌ Full error:", err);
    res.status(500).json({ 
      error: "Failed to send email. Please try again later.",
      details: err.message 
    });
  }
});


// ✅ Bug Report Endpoint
app.post("/api/report-bug", async (req, res) => {
  try {
    const { name, email, description, attachment } = req.body;

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

    res.json({
      success: true,
      message: "Thank you for your report! We have received it and will review it shortly.",
    });
  } catch (err) {
    console.error("❌ Bug report error:", err.message);
    console.error("❌ Full error stack:", err.stack);

    res.status(500).json({
      error: "Failed to submit report. Please try again later.",
      details: err.message,
    });
  }
});


// ✅ Start local server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Local API running at http://localhost:${PORT}/api/chat`)
);
