import React from "react";
import "../styles/App.css";

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1>Hi, I'm <span className="highlight">Pratap Singh</span></h1>
        <h2>Java Developer | Spring Boot | MySQL | Frontend Enthusiast</h2>
        <p>
          Passionate Java developer with 3+ years of experience building
          scalable and secure backend systems using Spring Boot and modern technologies.
        </p>
        <a href="#experience" className="cta-button">View My Experience</a>
      </div>
    </section>
  );
};

export default Hero;
