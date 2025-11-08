import React from "react";
import "../styles/App.css";

const Projects = () => {
  return (
    <section id="projects" className="projects-section">
      <h2 className="section-title">Projects</h2>

      <div className="project-card">
        <h3>Bus Reservation System</h3>
        <p className="tech-stack">Tech Stack: Java, JSP, MySQL, HTML, CSS, JavaScript</p>
        <p>
          Designed and implemented a complete bus booking and management system where users could book, 
          view, and cancel tickets. Optimized SQL queries and database schema, improving response time by 30%.
        </p>
        {/* Once the project is available then un-comment below part and add git-repo */}
        {/* <a
          href="#"
          className="project-btn"
          onClick={(e) => e.preventDefault()}
        >
          View Details
        </a> */}
      </div>
    </section>
  );
};

export default Projects;
