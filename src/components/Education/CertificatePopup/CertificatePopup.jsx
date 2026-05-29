import React from "react";
import "./CertificatePopup.css";

const CertificatePopup = ({ showPopup, setShowPopup, certificateSrc, certificateTitle }) => {
  if (!showPopup) return null;

  return (
    <div className="popup-overlay" onClick={() => setShowPopup(false)}>
      <div className="popup-container certificate-popup" onClick={(e) => e.stopPropagation()}>
        {/* Close Button X */}
        <button
          onClick={() => setShowPopup(false)}
          className="popup-close-x"
        >
          ×
        </button>

        <h3 className="popup-title">{certificateTitle}</h3>
        <img
          src={certificateSrc}
          alt={certificateTitle}
          className="certificate-image"
        />
      </div>
    </div>
  );
};

export default CertificatePopup;
