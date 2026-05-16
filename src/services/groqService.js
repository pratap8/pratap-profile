import { resumeData } from "../data/resume.js";

export const askGroq = async (userMessage) => {
  const apiKey = process.env.REACT_APP_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("REACT_APP_GROQ_API_KEY environment variable is not set");
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant representing Pratap Singh, a Java Full Stack Developer. ${resumeData}

Important Instructions:
- Answer questions ONLY based on the resume provided above
- If information is not in the resume, respond with: "I don't have that information in my resume"
- Keep responses concise and professional
- Be friendly and helpful`,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No response from AI";
  } catch (error) {
    console.error("Groq API Error:", error);
    throw error;
  }
};
