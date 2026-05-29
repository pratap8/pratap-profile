import React from "react";
import "./ProfilePhotoPopup.css";

const ProfilePhotoPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="profile-photo-overlay" onClick={onClose}>
      <div className="profile-photo-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <img src="/DP.JPEG" alt="Profile Photo" className="full-photo" />
      </div>
    </div>
  );
};

export default ProfilePhotoPopup;
