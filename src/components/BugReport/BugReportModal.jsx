import React, { useState, useRef } from "react";
import "./BugReportModal.css";

const BugReportModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    attachment: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("File size must be less than 5MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        attachment: file,
      }));
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      setMessage("Please enter a description");
      return;
    }

    if (formData.description.length > 2000) {
      setMessage("Description cannot exceed 2000 characters");
      return;
    }

    setLoading(true);

    try {
      // Prepare data to send
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        description: formData.description,
        attachment: null,
      };

      // Convert file to base64 if exists
      if (formData.attachment) {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64String = reader.result.split(",")[1]; // Remove "data:...;base64," prefix
            dataToSend.attachment = {
              filename: formData.attachment.name,
              data: base64String,
            };

            await sendReport(dataToSend);
          } catch (error) {
            console.error("Error processing file:", error);
            setMessage("Error processing attachment. Please try again.");
            setLoading(false);
          }
        };
        reader.readAsDataURL(formData.attachment);
      } else {
        await sendReport(dataToSend);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      setMessage("Error submitting report. Please try again.");
      setLoading(false);
    }
  };

  const sendReport = async (dataToSend) => {
    try {
      const response = await fetch("/api/report-bug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Report submitted successfully! Thank you for your feedback.");
        setFormData({
          name: "",
          email: "",
          description: "",
          attachment: null,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setMessage("");
        }, 2000);
      } else {
        setMessage(data.error || "Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      setMessage("Error submitting report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bug-report-modal-overlay" onClick={onClose}>
      <div className="bug-report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Report a Bug or Sensitive Information</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="bug-report-form">
          <div className="form-group">
            <label htmlFor="name">Name (Optional)</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email (Optional)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description {formData.description.length}/2000
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Please describe the issue, bug, or sensitive information you'd like to report..."
              maxLength="2000"
              rows="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="attachment">Attachment (Optional)</label>
            <input
              type="file"
              id="attachment"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx,.xlsx"
              className="file-input"
            />
            {formData.attachment && (
              <p className="file-name">
                📎 {formData.attachment.name} ({(formData.attachment.size / 1024).toFixed(2)} KB)
              </p>
            )}
            <p className="file-hint">Max size: 5MB. Allowed formats: PDF, PNG, JPG, TXT, DOC, DOCX, XLSX</p>
          </div>

          {message && (
            <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
              {message}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BugReportModal;
