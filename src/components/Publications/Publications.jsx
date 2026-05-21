import React, { useState } from "react";
import "./Publications.css";
import HanumanPopup from "./HanumanPopup";
import PatentPopup from "./PatentPopup";
import PublicationCard from "./PublicationCard";

const Publications = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPatentPopup, setShowPatentPopup] = useState(false);

  const publications = [
    {
      description:
        "A review on theoretical analysis for solar powered thermal system by using acetone",
      publishedIn: "AIP Publishing",
      date: "May 22, 2023",
      link: "https://pubs.aip.org/aip/acp/article-abstract/2492/1/020068/2891984/A-review-on-theoretical-analysis-for-solar-powered?redirectedFrom=fulltext",
    },
    {
      description: "Design Patent of Pepper Processing Machine",
      publishedIn: "Intellectual Property of India",
      date: "Aug 6, 2021",
      designNumber: "316274-001",
      Application: "202141034362 A",
      journalNumber: "32/2021",
      link: "https://search.ipindia.gov.in/IPOJournal/Journal/Patent",
    },
  ];

  return (
    <section id="publications" className="publications-section">
      {/* Clickable Header */}
      <h2 className="section-title" onClick={() => setShowPopup(true)}>
        Publications
      </h2>

      {/* Popups */}
      <HanumanPopup showPopup={showPopup} setShowPopup={setShowPopup} />
      <PatentPopup showPatentPopup={showPatentPopup} setShowPatentPopup={setShowPatentPopup} />

      {/* Publication Cards Grid */}
      <div className="publications-grid">
        {publications.map((pub, index) => (
          <PublicationCard
            key={index}
            publication={pub}
            index={index}
            onViewPatent={() => setShowPatentPopup(true)}
          />
        ))}
      </div>
    </section>
  );
};

export default Publications;
