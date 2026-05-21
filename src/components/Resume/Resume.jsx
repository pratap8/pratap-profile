import React, { useState, useEffect } from "react";
import "./Resume.css";

const Resume = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const defaultResumeUrl = `${process.env.PUBLIC_URL || ""}/PratapResume.pdf`;

  // Load any stored uploaded resume
  useEffect(() => {
    const storedFile = localStorage.getItem("resumeFile");
    if (storedFile) {
      setResumeFile(storedFile);
    }
  }, []);

  // Download uploaded or default resume
  const handleDownload = () => {
    const downloadUrl = resumeFile || defaultResumeUrl;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "PratapResume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <div className="resume-preview">
            <iframe
              src={`${resumeFile || defaultResumeUrl}#toolbar=0&navpanes=0`}
              title={resumeFile ? "Resume Preview" : "PratapResume"}
              width="100%"
              height="500px"
              style={{ border: "none" }}
            ></iframe>
            <button className="resume-btn download" onClick={handleDownload}>
              Download Resume
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
