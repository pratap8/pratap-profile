import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SendFilesModal from "../SendFiles/SendFilesModal";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();
  const [isSendFilesOpen, setIsSendFilesOpen] = useState(false);

  const handleCameraClick = () => {
    navigate("/camera");
  };

  return (
    <footer className="footer-container">
      <div className="footer-buttons">
        <button className="footer-btn camera-btn" onClick={handleCameraClick}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          Random Camera
        </button>

        <button
          className="footer-btn pratap-btn"
          onClick={() => setIsSendFilesOpen(true)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
            <path d="M9 4v16" />
          </svg>
          Send Files
        </button>
      </div>

      <SendFilesModal
        isOpen={isSendFilesOpen}
        onClose={() => setIsSendFilesOpen(false)}
      />
    </footer>
  );
};

export default Footer;
