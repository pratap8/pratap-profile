import React from "react";
import "../styles/App.css";

const Skills = () => {
  const skills = [
    "Java", "Spring Boot", "Spring MVC", "JSP", "MySQL", 
    "Oracle SQL", "JavaScript", "Chart.js", "Bootstrap", 
    "HTML", "CSS", "JIRA", "Confluence", "Bitbucket", "Postman"
  ];

  return (
    <section id="skills" className="skills-section">
      <h2 className="section-title">Technical Skills</h2>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div key={index} className="skill-card">
            {skill}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
