import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import { askGroq } from "../services/groqService";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const message = input.trim();
    if (!message) return;

    setMessages((prev) => [...prev, { from: "user", text: message }]);
    setInput("");
    setLoading(true);

    try {
      const reply = await askGroq(message);
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
            {messages.length === 0 && (
              <div className="msg bot">
                👋 Hi! I'm Pratap's AI Assistant. Ask me anything about his experience, skills, or projects!
              </div>
            )}
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
            <button onClick={handleSend} disabled={loading}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;