import React, { useState } from "react";
import "./Education.css";
import ImagePopup from "./ImagePopup";

const Education = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const educationData = [
    {
      institution: "MLR Institute of Technology",
      degree: "Bachelor of Technology - BTech",
      cgpa: "CGPA: 8.3/10",
      duration: "July 2017 – September 2020",
      achievements: [
        "Winner of the IIT Madras I'MPACT Competition (National Level), 2019.",
        "Published a design patent for a Pepper Processing Machine.",
        "Published a research paper titled 'A Review on Theoretical Analysis of a Solar-Powered Thermal System Using Acetone.'",
        "Served as a member of TITA (Telangana Information Technology Association) in two districts: Mulugu and Wanaparthy."
      ]
    },
    {
      institution: "V N R Vignana Jyothi Institute of Engineering & Technology",
      degree: "Diploma",
      cgpa: "Grade: 84.85%",
      duration: "September 2014 – April 2017",
      achievements: [
        "Completed a paid internship at Roctool Engineers Pvt Ltd, gaining hands-on experience in practical engineering applications."
      ],
      image: {
        src: "/Roctool.jpg",
        alt: "Roctool Engineers Internship"
      }
    },
    {
      institution: "New Brilliant Techno High School",
      degree: "School",
      cgpa: "CGPA: 7.5/10",
      duration: "Jun 2009 – Mar 2014",
      achievements: [
        "Actively participated in outdoor sports, including Cricket and Volleyball.",
        "Secured 1st Place in Chess and 2nd Place in Essay Writing in competitive events."
      ]
    }
  ];

  return (
    <section id="education" className="education-section">
      <h2 className="section-title">Education</h2>

      <div className="education-container">
        {educationData.map((edu, index) => (
          <div key={index} className="education-card">
            <div className="education-header">
              <h3 className="education-institution">{edu.institution}</h3>
              <div className="education-details">
                <p className="education-degree">{edu.degree}</p>
                <p className="education-cgpa">{edu.cgpa}</p>
                <p className="education-duration">{edu.duration}</p>
              </div>
            </div>

            <ul className="achievements-list">
              {edu.achievements.map((achievement, idx) => (
                <li key={idx}>{achievement}</li>
              ))}
            </ul>

            {edu.image && (
              <div
                className="education-image-preview"
                onClick={() => setSelectedImage(edu.image)}
                style={{ cursor: "pointer" }}
              >
                <img src={edu.image.src} alt={edu.image.alt} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image Popup */}
      <ImagePopup
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </section>
  );
};

export default Education;
