import { useState } from "react";
import "./Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Auto-switch API for Local vs Vercel
  const API_URL = import.meta.env.DEV
    ? "http://localhost:5000/api/chat"
    : "/api/chat";

  const handleSend = async () => {
    const question = input.trim();
    if (!question) return;

    setMessages((prev) => [...prev, { from: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await resp.json();
      const answer = data?.answer || "No response from AI.";

      setMessages((prev) => [...prev, { from: "bot", text: answer }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Error: unable to reach AI." },
      ]);
    }

    setLoading(false);
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
            <h4>Pratap Info</h4>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chatbot-body">
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
