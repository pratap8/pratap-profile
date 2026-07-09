import { useState, useRef, useEffect } from "react";
import "./FeedbackSuggestion.css";

function FeedbackSuggestion() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = message.trim();
    const trimmedName = name.trim();

    if (!trimmed) return;
    if (trimmedName.length > 30) {
      setError("Name cannot exceed 30 characters.");
      return;
    }
    if (trimmed.length > 500) {
      setError("Message cannot exceed 500 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/send-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmedName, message: trimmed }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send suggestion.");
      }

      setSubmitted(true);
      setMessage("");
    } catch (err) {
      setError(err.message || "Failed to send suggestion.");
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setSubmitted(false);
    setName("");
    setMessage("");
    setError("");
  };

  const openPanel = () => {
    resetState();
    setIsOpen(true);
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  return (
    <div className="feedback-suggestion">
      {!isOpen && (
        <button
          className="feedback-open-btn"
          onClick={openPanel}
          type="button"
          aria-label="Open feedback"
          title="Feedback / Suggestion"
        >
          <span className="feedback-bot-icon">🤖</span>
          <span className="feedback-bot-label">Feedback</span>
        </button>
      )}

      {isOpen && (
        <div className="feedback-window">
          <div className="feedback-header">
            <h4>Feedback & Suggestions</h4>
            <button onClick={closePanel} type="button" aria-label="Close feedback">
              ✖
            </button>
          </div>

          <div className="feedback-body">
            {!submitted ? (
              <>
                <p className="feedback-intro">
                  Share your ideas or suggestions with me.
                </p>
                <input
                  type="text"
                  className="feedback-name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 30))}
                  placeholder="Your name (optional)"
                  maxLength={30}
                />
                <div className="feedback-counter">Name: {name.length}/30</div>
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                  placeholder="Share your suggestion..."
                  rows={5}
                  maxLength={500}
                />
                <div className="feedback-counter">Message: {message.length}/500</div>
                {error && <p className="feedback-error">{error}</p>}
                <button
                  type="button"
                  className="feedback-send-btn"
                  onClick={handleSend}
                  disabled={loading || !message.trim()}
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </>
            ) : (
              <div className="feedback-success" role="status" aria-live="polite">
                <span className="feedback-tick">✓</span>
                <p>Thanks for your suggestion!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackSuggestion;
