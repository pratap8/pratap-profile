import React, { useState, useEffect } from "react";
import "./Resume.css";
import EmailModal from "./EmailModal";

const Resume = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
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

  // Send resume via email
  const handleSendEmail = async (data) => {
    try {
      // Use /api/send-resume which works for both localhost and Vercel
      const response = await fetch("/api/send-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email");
      }

      return result;
    } catch (err) {
      throw new Error(err.message || "Error sending email");
    }
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
            <div className="resume-actions">
              <button className="resume-btn download" onClick={handleDownload}>
                Download Resume
              </button>
              <button 
                className="resume-btn send-email" 
                onClick={() => setIsEmailModalOpen(true)}
              >
                Send to Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSend={handleSendEmail}
      />
    </section>
  );
};

export default Resume;
