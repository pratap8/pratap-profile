import React, { useState } from "react";
import BugReportModal from "./BugReportModal";
import "./BugReport.css";

const BugReport = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  return (
    <>
      <div className="bug-report-stripe" onClick={handleOpen}>
        <div className="stripe-content">
          <span className="stripe-icon">🐛</span>
          <span className="stripe-text">Report a Bug or Sensitive Information</span>
          <span className="stripe-arrow">→</span>
        </div>
      </div>
      <BugReportModal isOpen={isModalOpen} onClose={handleClose} />
    </>
  );
};

export default BugReport;
