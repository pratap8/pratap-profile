export const askGroq = async (userMessage) => {
  try {
    // On Vercel, use relative path /api/chat
    // In local development, use http://localhost:5000/api/chat
    const backendUrl = process.env.NODE_ENV === "production" 
      ? "/api/chat" 
      : (process.env.REACT_APP_BACKEND_URL || "http://localhost:5000") + "/api/chat";
    
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Backend error: ${response.status}`);
    }

    const data = await response.json();
    return data.reply || "No response from AI";
  } catch (error) {
    console.error("Chat API Error:", error);
    throw error;
  }
};
