import React, { useState } from "react";
import "./Navbar.css";
import ProfilePhotoPopup from "./ProfilePhotoPopup";

const Navbar = () => {
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="logo-container">
          <img 
            src="/DP.JPEG" 
            alt="Profile" 
            className="profile-pic"
            onClick={() => setIsPhotoOpen(true)}
            title="Click to view full photo"
          />
          <h2 className="logo">Phool Babu Raj Pratap Singh</h2>
        </div>
        <ul className="nav-links">
          <li><a href="#experience">Experience</a></li>
          <li><a href="#education">Education</a></li>
          <li><a href="#resume">Resume</a></li>
          <li><a href="#certificates">Certificates</a></li>
          <li><a href="#publications">Publications</a></li>
          <li><a href="#honors">Honors & Awards</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#contact">Contacts</a></li>
        </ul>
      </nav>

      <ProfilePhotoPopup 
        isOpen={isPhotoOpen} 
        onClose={() => setIsPhotoOpen(false)}
      />
    </>
  );
};

export default Navbar;
