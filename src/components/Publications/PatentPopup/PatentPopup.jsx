import React from "react";
import "./PatentPopup.css";

const PatentPopup = ({ showPatentPopup, setShowPatentPopup }) => {
  if (!showPatentPopup) return null;

  return (
    <div className="popup-overlay" onClick={() => setShowPatentPopup(false)}>
      <div className="popup-container patent-popup" onClick={(e) => e.stopPropagation()}>
        {/* Close Button X */}
        <button
          onClick={() => setShowPatentPopup(false)}
          className="popup-close-x"
        >
          ×
        </button>

        <h3 className="popup-title">Pepper Processing Machine Patent</h3>
        <iframe
          src={`${process.env.PUBLIC_URL}/Pepper Processing Machine Patent.pdf`}
          className="patent-iframe"
          title="Pepper Processing Machine Patent"
        />
      </div>
    </div>
  );
};

export default PatentPopup;
