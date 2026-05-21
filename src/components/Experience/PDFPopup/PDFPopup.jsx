import React from "react";
import "./PDFPopup.css";

const PDFPopup = ({ selectedPDF, onClose }) => {
  if (!selectedPDF) return null;

  return (
    <div className="pdf-popup-overlay" onClick={onClose}>
      <div className="pdf-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="pdf-popup-close" onClick={onClose}>
          ✕
        </button>
        <iframe
          src={selectedPDF.src}
          title={selectedPDF.alt}
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
};

export default PDFPopup;
