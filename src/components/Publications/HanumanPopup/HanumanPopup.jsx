import React, { useState, useEffect } from "react";
import "./HanumanPopup.css";

const HanumanPopup = ({ showPopup, setShowPopup }) => {
  const [fileText, setFileText] = useState("");

  useEffect(() => {
    if (showPopup) {
      fetch(`${process.env.PUBLIC_URL}/Hanuman.txt`)
        .then((res) => res.text())
        .then((data) => setFileText(data))
        .catch((err) => console.error("Error loading file:", err));
    }
  }, [showPopup]);

  if (!showPopup) return null;

  return (
    <div className="popup-overlay" onClick={() => setShowPopup(false)}>
      <div className="popup-container hanuman-popup" onClick={(e) => e.stopPropagation()}>
        <h3 className="popup-title">Hanuman Chalisa</h3>
        <pre className="popup-content">{fileText}</pre>
        <p className="popup-disclaimer">
          Disclaimer: The above is the Hanuman Chalisa. The author has provided it so that he can enjoy it ad-free and without the need for the internet.
        </p>
        <button
          onClick={() => setShowPopup(false)}
          className="popup-close-btn"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default HanumanPopup;
