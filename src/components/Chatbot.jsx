import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const message = input.trim();
    if (!message) return;

    // Show user message
    setMessages((prev) => [...prev, { from: "user", text: message }]);
    setInput("");
    setLoading(true);

    try {
      // ✅ API call (works locally & on Vercel)
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await resp.json();
      const reply = data?.reply || data?.error || "No response from AI.";

      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Error: Unable to reach the AI service." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      {!isOpen && (
        <button className="chatbot-btn" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h4>AI Assistant</h4>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chatbot-body" ref={bodyRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="msg bot">Thinking...</div>}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
