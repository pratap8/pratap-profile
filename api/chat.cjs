// api/chat.cjs
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const resumeData = `
PHOOL BABU RAJ PRATAP SINGH
Java Full Stack Developer | Spring Boot | React | MySQL | Microservices
+91-8790565427 | phool8790@gmail.com | LinkedIn | Portfolio

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

EDUCATION
MLR Institute of Technology, Hyderabad
B.Tech

EXTRACURRICULAR
• Involved in Corporate Social Responsibility initiatives, educating rural students.
• Member of Telangana Information Technology Association (TITA) since 2019.
`;

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GROQ_API_KEY;
    console.log("🔑 Using Groq Key:", apiKey ? "✅ Found" : "❌ Missing");
    console.log("🔑 Available env vars:", Object.keys(process.env).filter(k => k.includes('GROQ')).join(', '));

    if (!apiKey) {
      console.error("❌ Missing GROQ_API_KEY environment variable");
      console.error("Available keys:", Object.keys(process.env).filter(k => k.includes('GROQ')));
      return res.status(500).json({ error: "Missing GROQ_API_KEY in Vercel environment. Add it in Vercel Dashboard > Settings > Environment Variables" });
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
    res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Chat API error:", err.message);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};
