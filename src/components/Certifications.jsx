import React from "react";
import "../styles/App.css";

const Certificates = () => {
  const certificates = [
    {
      title: "Oracle Certified Professional: Java SE 11 Developer",
      image: `${process.env.PUBLIC_URL}/certificates/Java11.jpg`,
      link: `https://catalog-education.oracle.com/ords/certview/sharebadge?id=6A9A38B971D667150AF032CAD22D9B57D8672D190EEECC73F310C0EF230FF291`,
    },
    {
      title: "Oracle Cloud Infrastructure 2025",
      image: `${process.env.PUBLIC_URL}/certificates/Cloud Infrastructure.jpg`,
      link: `https://catalog-education.oracle.com/ords/certview/sharebadge?id=AC96673CC4202633A20710F68D79506C0BBA84CE91554DD9BD24EFE9981C2358`,
    },
    {
      title: "Microsoft Certified: Azure Fundamentals",
      image: `${process.env.PUBLIC_URL}/certificates/Azure Fundamentals.jpg`,
      link: `https://www.credly.com/badges/c86ea5d6-ccbc-4a74-8938-75f94c3e9035?source=linked_in_profile`,
    },  
    // ➕ Add more certificates here
  ];

  return (
    <section id="certificates" className="certificates-section">
      <h2 className="section-title-certificate">Certificates</h2>

      <div className="certificates-grid">
        {certificates.map((cert, index) => (
          <div key={index} className="certificate-card">
            <img
              src={cert.image}
              alt={cert.title}
              className="certificate-img"
            />
            <h3 className="certificate-title">{cert.title}</h3>
            <a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="view-btn"
            >
              View Certificate
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Certificates;
