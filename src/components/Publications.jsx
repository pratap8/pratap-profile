import React, { useState, useEffect } from "react";
import "../styles/App.css";

const Publications = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [fileText, setFileText] = useState("");
  const [showPatentPopup, setShowPatentPopup] = useState(false);

  // Load the Hanuman.txt file from the public folder
  useEffect(() => {
    if (showPopup) {
      fetch(`${process.env.PUBLIC_URL}/Hanuman.txt`)
        .then((res) => res.text())
        .then((data) => setFileText(data))
        .catch((err) => console.error("Error loading file:", err));
    }
  }, [showPopup]);

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
      <h2
        className="section-title"
        style={{ cursor: "none" }}
        onClick={() => setShowPopup(true)}
      >
        Publications
      </h2>

      {/* Popup Window */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowPopup(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "70%",
              maxWidth: "700px",
              maxHeight: "70%",
              overflowY: "auto",
              boxShadow: "0 0 15px rgba(0,0,0,0.3)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
              Hanuman Chalisa
            </h3>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
                textAlign: "justify",
                marginBottom: "15px",
              }}
            >
              {fileText}
            </pre>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#b40606ff",
                borderTop: "1px solid #ddd",
                paddingTop: "10px",
                textAlign: "center",
              }}
            >
              Disclaimer: The above is the Hanuman Chalisa. The author has provided it so that he can enjoy it ad-free and without the need for the internet.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                display: "block",
                margin: "10px auto 0",
                padding: "8px 16px",
                background: "#333",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Design Patent PDF Popup */}
      {showPatentPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowPatentPopup(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "80%",
              maxWidth: "900px",
              maxHeight: "90%",
              overflowY: "auto",
              boxShadow: "0 0 15px rgba(0,0,0,0.3)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button X */}
            <button
              onClick={() => setShowPatentPopup(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "#333",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "35px",
                height: "35px",
                fontSize: "24px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
              }}
            >
              ×
            </button>

            <h3 style={{ textAlign: "center", marginBottom: "15px", marginTop: 0 }}>
              Pepper Processing Machine Patent
            </h3>
            <iframe
              src={`${process.env.PUBLIC_URL}/Pepper Processing Machine Patent.pdf`}
              style={{
                width: "100%",
                height: "600px",
                border: "none",
                borderRadius: "5px",
              }}
              title="Pepper Processing Machine Patent"
            />
          </div>
        </div>
      )}

      {/* Existing Publication Cards */}
      <div className="publications-grid">
        {publications.map((pub, index) => (
          <div key={index} className="publication-card">
            <p className="pub-description">{pub.description}</p>

            <div className="pub-details">
              {pub.publishedIn && (
                <p>
                  <strong>Published In:</strong> {pub.publishedIn}
                </p>
              )}
              {pub.date && (
                <p>
                  <strong>Date:</strong> {pub.date}
                </p>
              )}
              {pub.designNumber && (
                <p>
                  <strong>Design Number:</strong> {pub.designNumber}
                </p>
              )}
              {pub.application && (
                <p>
                  <strong>Application No:</strong> {pub.application}
                </p>
              )}
              {pub.journalNumber && (
                <p>
                  <strong>Journal No:</strong> {pub.journalNumber}
                </p>
              )}
              {pub.volume && (
                <p>
                  <strong>Volume:</strong> {pub.volume}
                </p>
              )}
            </div>

            {index === 1 ? (
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setShowPatentPopup(true)}
                  className="view-btn"
                >
                  View Design Patent
                </button>
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-btn"
                >
                  View Publication
                </a>
              </div>
            ) : (
              <a
                href={pub.link}
                target="_blank"
                rel="noopener noreferrer"
                className="view-btn"
              >
                View Publication
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Publications;
