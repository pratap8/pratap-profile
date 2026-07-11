import { useState, useRef, useEffect, useCallback } from "react";
import "./Chatbot.css";
import { askGroq } from "../../services/groqService";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyMode, setReplyMode] = useState("text");
  const [isListening, setIsListening] = useState(false);
  const [voiceSupportStatus, setVoiceSupportStatus] = useState("");
  const bodyRef = useRef(null);
  const recognitionRef = useRef(null);
  const pendingTranscriptRef = useRef("");
  const replyModeRef = useRef(replyMode);
  const isRespondingRef = useRef(false);
  const speechUtteranceRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const recognitionActiveRef = useRef(false);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    replyModeRef.current = replyMode;
  }, [replyMode]);

  useEffect(() => {
    const speechRecognitionSupported =
      typeof window !== "undefined" &&
      Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
    const speechSynthesisSupported =
      typeof window !== "undefined" &&
      Boolean(
        window.speechSynthesis ||
          window.SpeechSynthesisUtterance ||
          window.webkitSpeechSynthesisUtterance
      );

    if (!speechRecognitionSupported || !speechSynthesisSupported) {
      setVoiceSupportStatus("Voice features are unavailable in this browser.");
    } else {
      setVoiceSupportStatus("");
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume?.();
    }
    speechUtteranceRef.current = null;
  }, []);

  const resetVoiceInputState = useCallback(() => {
    pendingTranscriptRef.current = "";
    setInput("");
    if (silenceTimerRef.current) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const warmUpSpeech = useCallback(() => {
    if (replyModeRef.current !== "voice" || typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    const utteranceCtor =
      window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance;

    if (!utteranceCtor) {
      return;
    }

    try {
      stopSpeaking();
      const utterance = new utteranceCtor("Ready");
      utterance.lang = "en-US";
      utterance.volume = 0.01;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Speech synthesis warmup error:", error);
    }
  }, [stopSpeaking]);

  const speakReply = useCallback((text) => {
    if (replyModeRef.current !== "voice" || typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    const utteranceCtor =
      window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance;

    if (!utteranceCtor) {
      return;
    }

    try {
      stopSpeaking();
      const utterance = new utteranceCtor(text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Speech synthesis error:", error);
    }
  }, [stopSpeaking]);

  const sendTextMessage = useCallback(async (message) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setMessages((prev) => [...prev, { from: "user", text: trimmedMessage }]);
    setInput("");
    setLoading(true);

    try {
      const reply = await askGroq(trimmedMessage);
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);

      if (replyMode === "voice") {
        speakReply(reply);
      }
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Error: Unable to reach the AI service." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [replyMode, speakReply]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      recognitionActiveRef.current = true;
    };

    recognition.onresult = (event) => {
      const latestResultIndex = typeof event.resultIndex === "number" ? event.resultIndex : event.results?.length - 1;
      const latestResult = event.results?.[latestResultIndex];
      const transcript = latestResult?.[0]?.transcript?.trim() ?? "";

      if (transcript) {
        pendingTranscriptRef.current = transcript;
        setInput(transcript);
      }

      if (transcript && replyModeRef.current === "voice") {
        stopSpeaking();
        setIsListening(true);
      }

      if (transcript) {
        if (silenceTimerRef.current) {
          window.clearTimeout(silenceTimerRef.current);
        }
        silenceTimerRef.current = window.setTimeout(() => {
          const finalTranscript = pendingTranscriptRef.current.trim();
          if (finalTranscript) {
            pendingTranscriptRef.current = "";
            setInput(finalTranscript);
            isRespondingRef.current = true;
            void sendTextMessage(finalTranscript).finally(() => {
              isRespondingRef.current = false;
              if (recognitionRef.current && replyModeRef.current === "voice" && !recognitionActiveRef.current) {
                recognitionRef.current.start();
              }
            });
          }
        }, 300);
      }
    };

    recognition.onerror = () => {
      recognitionActiveRef.current = false;
      setIsListening(false);
    };

    recognition.onend = () => {
      recognitionActiveRef.current = false;
      if (isRespondingRef.current) {
        return;
      }

      setIsListening(false);
      if (silenceTimerRef.current) {
        window.clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      const finalTranscript = pendingTranscriptRef.current.trim();
      if (finalTranscript) {
        pendingTranscriptRef.current = "";
        setInput(finalTranscript);
        isRespondingRef.current = true;
        void sendTextMessage(finalTranscript).finally(() => {
          isRespondingRef.current = false;
          if (recognitionRef.current && replyModeRef.current === "voice") {
            recognitionRef.current.start();
          }
        });
      } else if (replyModeRef.current === "voice" && !recognitionActiveRef.current) {
        recognitionRef.current?.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (silenceTimerRef.current) {
        window.clearTimeout(silenceTimerRef.current);
      }
      recognition.stop();
    };
  }, [sendTextMessage, stopSpeaking]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startVoiceInput = () => {
    if (!recognitionRef.current) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "🎤 Voice input is not supported in this browser." },
      ]);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    warmUpSpeech();
    if (!recognitionActiveRef.current) {
      resetVoiceInputState();
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = () => {
    const message = input.trim();
    if (!message) return;

    if (replyMode === "voice") {
      warmUpSpeech();
    }

    void sendTextMessage(message);
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
            <h4>Pratap's AI Assistant</h4>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chatbot-toolbar">
            <label className="reply-mode" htmlFor="reply-mode-select">
              <span>Reply mode</span>
              <select
                id="reply-mode-select"
                aria-label="Reply mode"
                value={replyMode}
                onChange={(e) => {
                  const nextMode = e.target.value;
                  replyModeRef.current = nextMode;
                  setReplyMode(nextMode);

                  if (nextMode === "voice") {
                    warmUpSpeech();
                  }
                }}
              >
                <option value="text">Text</option>
                <option value="voice">Voice</option>
              </select>
            </label>
            <button
              type="button"
              className={`voice-toggle ${isListening ? "active" : ""}`}
              onClick={startVoiceInput}
              title={isListening ? "Stop listening" : "Speak your message"}
            >
              {isListening ? "🔴" : "🎙️"}
            </button>
          </div>

          {voiceSupportStatus && (
            <div className="chatbot-status">{voiceSupportStatus}</div>
          )}

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
            <button type="button" onClick={handleSend} disabled={loading}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
