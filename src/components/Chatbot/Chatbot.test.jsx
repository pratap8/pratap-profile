import React from "react";
import ReactDOM from "react-dom/client";
import { act } from "react";
import { Simulate } from "react-dom/test-utils";
import Chatbot from "./Chatbot";
import { askGroq } from "../../services/groqService";

jest.mock("../../services/groqService", () => ({
  askGroq: jest.fn(),
}));

describe("Chatbot voice reply mode", () => {
  let container;
  let root;

  beforeEach(() => {
    jest.clearAllMocks();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);

    Object.defineProperty(window, "speechSynthesis", {
      value: {
        speak: jest.fn(),
        cancel: jest.fn(),
      },
      writable: true,
    });

    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      value: function SpeechSynthesisUtterance(text) {
        this.text = text;
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("does not try to restart speech recognition while it is already active", async () => {
    let startAttempts = 0;
    let recognitionInstance;
    class FakeRecognition {
      constructor() {
        recognitionInstance = this;
        this.lang = "";
        this.continuous = false;
        this.interimResults = false;
        this.onresult = null;
        this.onerror = null;
        this.onend = null;
      }

      start() {
        startAttempts += 1;
        if (startAttempts > 1) {
          throw new DOMException("already started", "InvalidStateError");
        }
      }

      stop() {
        if (this.onend) {
          this.onend();
        }
      }
    }

    Object.defineProperty(window, "SpeechRecognition", {
      value: FakeRecognition,
      writable: true,
    });
    Object.defineProperty(window, "webkitSpeechRecognition", {
      value: FakeRecognition,
      writable: true,
    });

    await act(async () => {
      root.render(<Chatbot />);
    });

    const micButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.title === "Speak your message"
    );

    await act(async () => {
      Simulate.click(micButton);
    });

    await act(async () => {
      recognitionInstance.onend();
    });

    expect(startAttempts).toBe(1);
  });

  it("auto-sends the captured speech after a short silence", async () => {
    jest.useFakeTimers();
    askGroq.mockResolvedValueOnce("Thanks");

    let recognitionInstance;
    class FakeRecognition {
      constructor() {
        recognitionInstance = this;
        this.lang = "";
        this.continuous = false;
        this.interimResults = false;
        this.onresult = null;
        this.onerror = null;
        this.onend = null;
      }

      start() {}
      stop() {
        if (this.onend) {
          this.onend();
        }
      }
    }

    Object.defineProperty(window, "SpeechRecognition", {
      value: FakeRecognition,
      writable: true,
    });
    Object.defineProperty(window, "webkitSpeechRecognition", {
      value: FakeRecognition,
      writable: true,
    });

    await act(async () => {
      root.render(<Chatbot />);
    });

    await act(async () => {
      recognitionInstance.onresult({
        results: [[{ transcript: "Tell me about Pratap" }]],
      });
    });

    await act(async () => {
      recognitionInstance.stop();
      jest.advanceTimersByTime(300);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(askGroq).toHaveBeenCalledWith("Tell me about Pratap");
  });

  it("speaks the bot reply when voice reply mode is selected", async () => {
    askGroq.mockResolvedValueOnce("Hi from voice mode");

    await act(async () => {
      root.render(<Chatbot />);
    });

    const select = container.querySelector('select[aria-label="Reply mode"]');
    await act(async () => {
      select.value = "voice";
      Simulate.change(select);
    });

    const input = container.querySelector('input[placeholder="Ask something..."]');
    await act(async () => {
      input.value = "Tell me about Pratap";
      Simulate.change(input);
    });

    const sendButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Send"
    );

    await act(async () => {
      Simulate.click(sendButton);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(askGroq).toHaveBeenCalledWith("Tell me about Pratap");
    expect(container.textContent).toContain("Hi from voice mode");
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });

  it("uses speech synthesis for spoken replies", async () => {
    askGroq.mockResolvedValueOnce("Voice reply is working");

    await act(async () => {
      root.render(<Chatbot />);
    });

    const select = container.querySelector('select[aria-label="Reply mode"]');
    await act(async () => {
      select.value = "voice";
      Simulate.change(select);
    });

    const input = container.querySelector('input[placeholder="Ask something..."]');
    await act(async () => {
      input.value = "Tell me about Pratap";
      Simulate.change(input);
    });

    const sendButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Send"
    );

    await act(async () => {
      Simulate.click(sendButton);
      await Promise.resolve();
    });

    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });

  it("plays audio for auto-sent voice replies", async () => {
    askGroq.mockResolvedValueOnce("Voice reply is working");

    let recognitionInstance;
    class FakeRecognition {
      constructor() {
        recognitionInstance = this;
        this.lang = "";
        this.continuous = false;
        this.interimResults = false;
        this.onresult = null;
        this.onerror = null;
        this.onend = null;
      }

      start() {}
      stop() {
        if (this.onend) {
          this.onend();
        }
      }
    }

    Object.defineProperty(window, "SpeechRecognition", {
      value: FakeRecognition,
      writable: true,
    });
    Object.defineProperty(window, "webkitSpeechRecognition", {
      value: FakeRecognition,
      writable: true,
    });

    await act(async () => {
      root.render(<Chatbot />);
    });

    const select = container.querySelector('select[aria-label="Reply mode"]');
    await act(async () => {
      select.value = "voice";
      Simulate.change(select);
    });

    await act(async () => {
      recognitionInstance.onresult({
        results: [[{ transcript: "hello" }]],
      });
      recognitionInstance.stop();
      await Promise.resolve();
    });

    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });

  it("starts each voice turn with a fresh transcript instead of reusing the previous one", async () => {
    jest.useFakeTimers();
    askGroq.mockResolvedValue("Thanks");

    let recognitionInstance;
    class FakeRecognition {
      constructor() {
        recognitionInstance = this;
        this.lang = "";
        this.continuous = false;
        this.interimResults = false;
        this.onresult = null;
        this.onerror = null;
        this.onend = null;
      }

      start() {}
      stop() {
        if (this.onend) {
          this.onend();
        }
      }
    }

    Object.defineProperty(window, "SpeechRecognition", {
      value: FakeRecognition,
      writable: true,
    });
    Object.defineProperty(window, "webkitSpeechRecognition", {
      value: FakeRecognition,
      writable: true,
    });

    await act(async () => {
      root.render(<Chatbot />);
    });

    await act(async () => {
      recognitionInstance.onresult({
        resultIndex: 0,
        results: [[{ transcript: "first message" }]],
      });
    });

    await act(async () => {
      recognitionInstance.onresult({
        resultIndex: 0,
        results: [[{ transcript: "second message" }]],
      });
    });

    await act(async () => {
      recognitionInstance.stop();
      jest.advanceTimersByTime(300);
      await Promise.resolve();
    });

    expect(askGroq).toHaveBeenLastCalledWith("second message");
  });
});
