import React from "react";
import "../styles/App.css";

const Experience = () => {
  return (
    <section id="experience" className="experience-section">
      <h2 className="section-title">Experience</h2>
      <div className="experience-card">
        <h3>Analyst – Deloitte</h3>
        <p className="duration"> Client – VERIZON(US) | August 2025 – Present | Hyderabad (Hybrid)</p>
        <ul>
          <li>Currently working as a Java Full-Stack Developer at Verizon, engaged in the design, development, and optimization of
                enterprise-level applications where we delivered production-grade enterprise solutions .
          </li>
          <li>Gathering end-to-end requirements and delivering solutions by collaborating closely with business stakeholders and
              clients in an Agile environment.</li>
          <li>Developing both backend and frontend components using Java, Spring Boot, React, and JSP to build scalable and
user-friendly applications.</li>
          <li>Actively involved in defect resolution, debugging, and performance optimization to ensure application stability and
reliability.</li>
          <li>Writing robust unit tests using JUnit (Mockito framework), ensuring high code coverage and maintaining application
reliability.</li>
          <li>Proficient in database development, including writing complex SQL queries, stored procedures, and performance tuning.</li>
        <li> Implementing and enhancing application security using industry best practices (authentication, secure coding).</li>
        <li>Collaborating closely with cross-functional teams—including QA and DevOps—to ensure smooth integration, code
quality, and timely delivery.</li>
        </ul>
      </div>
      <div className="experience-card">
        <h3>Analyst – Deloitte</h3>
        <p className="duration">June 2025 – August 2025 | Hyderabad (Hybrid)</p>
        <ul>
          <li>Performed in-depth technical code reviews and impact analysis across 7 enterprise applications, uncovering >5000
            impactful issues.
          </li>
          <li>Utilized SonarQube to detect bugs, vulnerabilities, code smells, and security hotspots, identifying >20 high-severity and
              >1000 medium-severity issues per application</li>
          <li>Categorized findings into 7 Quality Attributes (Architecture, Performance, Scalability, Reliability, Security,
            Maintainability, SDLC), while classifying issues by High/Medium/Low/False Positive severity.</li>
          <li>Conducted deep source code analysis for all 7 applications, enhancing accuracy of issue detection and validation beyond
            automated scans.</li>
          <li>Prepared 7 detailed impact analysis reports (one per application) and a consolidated executive summary (PPT) for
            Deloitte leadership.</li>
          <li>Delivered insights that enabled leadership to present risks effectively to the client, strengthening trust and positioning
            Deloitte for future business opportunities.</li>
        </ul>
      </div>
      <div className="experience-card">
        <h3>Software Engineer – LTIMindtree</h3>
        <p className="duration">Client – CITI(Singapore) | March 2022 – June 2025 | Chennai (Hybrid)</p>
        <ul>
          <li>Developed executable code and SQL queries based on business requirements, boosting project outcomes by
            25%.</li>
          <li>Enhanced user experience by using the Chart.jsJavaScript library to display relevant, personalized data through
            interactive charts.
          </li>
          <li>Designed and maintained RESTful APIs using Spring Boot, ensuring a reliable and scalable architecture.
          </li>
          <li>Optimized SQL queries, resulting in a 30% improvement in performance and faster data processing.
          </li>
          <li>Conducted regular Black Duck scans, reducing vulnerabilities by 30% and enhancing productsecurity.
          </li>

          <li>Performed code analysis with SonarQube, achieving a 35% bug reduction, over 90% test coverage with JUnit
            with Mockito, and eliminated 100+ code smells using Sonar Lint, improving code maintainability.
          </li>
          <li>Utilized JIRA for comprehensive defect tracking and streamlined issue resolution.
          </li>
          <li>Collaborated with cross-functional teamsincluding functional analysts and QA testers to ensure seamless
            deliverables in each Scrum cycle.
          </li>
        </ul>
      </div>
    </section>

  );
};

export default Experience;
