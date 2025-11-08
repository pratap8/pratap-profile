import React, { useState, useEffect } from "react";
import "../styles/App.css";

const Resume = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [isGitHub, setIsGitHub] = useState(false);

  // Check if hosted on GitHub Pages
  useEffect(() => {
    const host = window.location.hostname;
    if (host.includes("github.io")) {
      setIsGitHub(true);
    } else {
      const storedFile = localStorage.getItem("resumeFile");
      if (storedFile) {
        setResumeFile(storedFile);
      }
    }
  }, []);

  // Handle PDF upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("❌ Only PDF files are allowed!");
      e.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("resumeFile", reader.result);
      setResumeFile(reader.result);
      window.scrollTo(0, 0);
    };
    reader.readAsDataURL(file);
  };

  // Delete uploaded resume
  const handleDelete = () => {
    localStorage.removeItem("resumeFile");
    setResumeFile(null);
  };

  return (
    <section id="resume" className="resume-section">
      <div className="resume-container">
        {/* Left side */}
        <div className="resume-left">
          <h2 className="section-title">P B R Pratap<br></br>Resume</h2>       
        </div>

        {/* Right side */}
        <div className="resume-right">
          {/* Show static PDF for GitHub Pages */}
          {isGitHub ? (
            <iframe
              src={`${process.env.PUBLIC_URL}/ResumePratap.pdf#toolbar=0&navpanes=0`}
              title="ResumePratap"
              width="100%"
              height="500px"
              style={{ border: "none" }}
            />
          ) : !resumeFile ? (
            <div className="upload-area">
              <p>No resume uploaded yet.</p>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
              />
            </div>
          ) : (
            <div className="resume-preview">
              <iframe
                src={`${resumeFile}#toolbar=0&navpanes=0`}
                title="Resume Preview"
                width="100%"
                height="500px"
                style={{ border: "none" }}
              ></iframe>
              <button className="resume-btn delete" onClick={handleDelete}>
                Delete Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Resume;
