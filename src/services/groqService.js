export const askGroq = async (userMessage) => {
  try {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
    
    const response = await fetch(`${backendUrl}/api/chat`, {
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
