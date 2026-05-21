import React, { useState } from "react";
import "./HonorsAwards.css";
import ImagePopup from "./ImagePopup";

const HonorsAwards = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const awards = [
    {
      title: "I'MPACT || Mechanica 2019",
      issuedBy: "Issued by IIT Madras · Mar 2019",
      associated: "Associated with MLR Institute of Technology",
      achievements: [
        "Led the team of five from fund raising till winning the competition.",
        "Won 1st Prize in the I'MPACT National-Level Competition conducted by IIT Madras.",
        "Pitched idea and received funding of ₹50,000 from MLRIT for the project.",
        "Awarded ₹8,000 by IIT Madras for successfully building a functional prototype(Pepper Processing Machine)."
      ],
      images: [
        {
          src: "/Mechanica.jpg",
          alt: "Mechanica Competition"
        },
        {
          src: "/MechanicaGroup.jpg",
          alt: "Mechanica Team Group Photo"
        }
      ]
    }
  ];

  return (
    <section id="honors" className="honors-section">
      <h2 className="section-title">Honors & Awards</h2>

      <div className="honors-container">
        {awards.map((award, index) => (
          <div key={index} className="award-card">
            <div className="award-header">
              <h3 className="award-title">{award.title}</h3>
              <p className="award-issued-by">{award.issuedBy}</p>
              <p className="award-associated">{award.associated}</p>
            </div>

            <p className="award-description">{award.description}</p>

            <ul className="achievements-list">
              {award.achievements.map((achievement, idx) => (
                <li key={idx}>{achievement}</li>
              ))}
            </ul>

            <div className="award-images">
              {award.images.map((image, idx) => (
                <div
                  key={idx}
                  className="image-preview"
                  onClick={() => setSelectedImage(image)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={image.src} alt={image.alt} />
                </div>
              ))}
            </div>
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

export default HonorsAwards;
