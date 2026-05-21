import React from "react";
import "./ImagePopup.css";

const ImagePopup = ({ selectedImage, onClose }) => {
  if (!selectedImage) return null;

  return (
    <div className="image-popup-overlay" onClick={onClose}>
      <div className="image-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-popup-close" onClick={onClose}>
          ✕
        </button>
        <img src={selectedImage.src} alt={selectedImage.alt} />
      </div>
    </div>
  );
};

export default ImagePopup;
