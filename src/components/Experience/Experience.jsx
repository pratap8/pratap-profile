import React, { useState } from "react";
import "./Experience.css";
import PDFPopup from "./PDFPopup";

const Experience = () => {
  const [selectedPDF, setSelectedPDF] = useState(null);

  const experiences = [
    {
      company: "Deloitte",
      isCompanyHeader: true,
      pdf: {
        src: "/Spot Award.pdf",
        alt: "Spot Award"
      },
      positions: [
        {
          position: "Analyst - Client: Verizon (US)",
          duration: "Sep 2026 - Present",
          location: "Hyderabad, Telangana, India · Hybrid",
          achievements: [
            "Currently working as a Java Full-Stack Developer for Verizon(Client), engaged in the design, development, and optimization of enterprise-level applications.",
            "Gathering end-to-end requirements and delivering solutions by collaborating with business stakeholders/Client.",
            "Writing robust unit tests using JUnit (Mockito framework), ensuring high code coverage and maintaining application reliability.",
            "Collaborating closely with cross-functional teams—including QA and DevOps—to ensure smooth integration, code quality, and timely delivery."
          ]
        },
        {
          position: "Analyst - Client: Confidential",
          duration: "Jun 2026 - Sep 2026 · 4 mos",
          location: "Hyderabad, Telangana, India · Hybrid",
          achievements: [
            "Performed in-depth technical code reviews and impact analysis across 7 enterprise applications, uncovering >5000 impactful issues.",
            "Utilized SonarQube to detect bugs, vulnerabilities, code smells, and security hotspots, identifying >20 high-severity and >1000 medium-severity issues per application.",
            "Identified critical risks such as hard-coded passwords inside codebase, missing WHERE clauses in SQL queries, and absent null checks and many more.",
            "Delivered insights that enabled leadership to present risks effectively to the client, strengthening trust and positioning Deloitte for business opportunities."
          ]
        }
      ]
    },
    {
      company: "LTIMindtree",
      isCompanyHeader: true,
      positions: [
        {
          position: "Senior Software Engineer",
          duration: "Oct 2024 - Jun 2025 · 9 mos",
          location: "Chennai, Tamil Nadu, India · Hybrid",
          achievements: [
            "Collaborated with cross-functional teams including functional analysts and QA testers to ensure seamless deliverables in each Scrum cycle.",
            "Enhanced user experience by using the Chart.js JavaScript library to display relevant, personalized data through interactive charts.",
            "Developed and maintained REST APIs using Spring Boot, ensuring reliable and scalable architecture.",
            "Played key role in migration from Monolithic architecture to Microservice architecture."
          ]
        },
        {
          position: "Software Engineer",
          duration: "Jun 2022 - Oct 2024 · 2 yrs 5 mos",
          location: "Chennai, Tamil Nadu, India · Hybrid",
          achievements: [
            "Developed and modified software solutions according to detailed design requirements.",
            "Developed executable code and queries from business requirements, boosting project outcomes by 25%.",
            "Optimized SQL queries, achieving a 30% performance boost and faster data processing.",
            "Conducted regular Black Duck scans, reducing vulnerabilities by 30% and enhancing product security.",
            "Utilized JIRA for 100% defect tracking and streamlined issue resolution.",
            "Performed code analysis with SonarQube, achieving a 35% bug reduction, above 90% test coverage using JUnit with Mockito, and eliminated 100+ code smells with Sonar Lint for improved maintainability."
          ]
        },
        {
          position: "Trainee",
          duration: "Mar 2022 - Jun 2022 · 4 mos",
          location: "Hyderabad, Telangana, India · Remote",
          achievements: [
            "Worked as Java full-stack developer, where we developed Bus Reservation System.",
            "Tech-Stack used: Front-end: Angular (12), Back-end: Java(8), Database: MySQL.",
            "Developed Fully functional site as per given requirement during internship."
          ]
        }
      ]
    }
  ];

  return (
    <section id="experience" className="experience-section">
      <h2 className="section-title">Experience</h2>

      <div className="experience-container">
        {experiences.map((exp, index) => (
          <div key={index}>
            {exp.isCompanyHeader ? (
              <div className="company-section">
                <h2 className="company-header">{exp.company}</h2>
                <div className="positions-container">
                  {exp.positions.map((pos, posIndex) => (
                    <div key={posIndex} className="position-card">
                      <div className="position-header">
                        <h3 className="position-title">{pos.position}</h3>
                        <p className="position-duration">{pos.duration}</p>
                        <p className="position-location">{pos.location}</p>
                      </div>

                      <ul className="achievements-list">
                        {pos.achievements.map((achievement, idx) => (
                          <li key={idx}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {exp.pdf && (
                  <div
                    className="pdf-preview-button"
                    onClick={() => setSelectedPDF(exp.pdf)}
                    style={{ cursor: "pointer" }}
                  >
                    📄 View Award Certificate
                  </div>
                )}
              </div>
            ) : (
              <div className="experience-card">
                <div className="experience-header">
                  <div className="experience-title-section">
                    <h3 className="experience-position">{exp.position}</h3>
                    <p className="experience-company">{exp.company}</p>
                  </div>
                  <p className="experience-duration">{exp.duration}</p>
                  <p className="experience-location">{exp.location}</p>
                </div>

                {exp.sections ? (
                  <div className="sections-container">
                    {exp.sections.map((section, sectionIdx) => (
                      <div key={sectionIdx} className="section-block">
                        <h4 className="section-title">{section.title}</h4>
                        <ul className="achievements-list">
                          {section.achievements.map((achievement, idx) => (
                            <li key={idx}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="achievements-list">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
                  </ul>
                )}

                {exp.pdf && (
                  <div
                    className="pdf-preview-button"
                    onClick={() => setSelectedPDF(exp.pdf)}
                    style={{ cursor: "pointer" }}
                  >
                    📄 View Award Certificate
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PDF Popup */}
      <PDFPopup
        selectedPDF={selectedPDF}
        onClose={() => setSelectedPDF(null)}
      />
    </section>
  );
};

export default Experience;
