import React from "react";
import "../styles/App.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">Phool Babu Raj Pratap Singh</h2>
      <ul className="nav-links">
        <li><a href="#experience">Experience</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#resume">Resume</a></li>
        <li><a href="#certificates">Certificates</a></li>
        <li><a href="#publications">Publications</a></li>
        <li><a href="#contact">Contacts</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
