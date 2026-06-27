import React, { useState, useRef } from "react";
import "./SendFilesModal.css";

const DEFAULT_EMAIL = "phool8790@gmail.com";

const SendFilesModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setEmail("");
    setSelectedFiles([]);
    setMessage("");
    setStatus("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeModal = () => {
    onClose();
    resetForm();
  };

  const mergeFiles = (incomingFiles) => {
    const newItems = Array.from(incomingFiles).map((file) => ({
      file,
      relativePath: file.webkitRelativePath || file.name,
      contentType: file.type || "application/octet-stream",
    }));

    const merged = [...selectedFiles, ...newItems];
    const unique = [];
    const seen = new Set();

    merged.forEach((item) => {
      if (!seen.has(item.relativePath)) {
        seen.add(item.relativePath);
        unique.push(item);
      }
    });

    setSelectedFiles(unique);
  };

  const handleFileChange = (event) => {
    if (event.target.files?.length) {
      mergeFiles(event.target.files);
    }
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setStatus("");

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage("Please enter a valid email address or leave it blank.");
      setStatus("error");
      return;
    }

    if (selectedFiles.length === 0) {
      setMessage("Please select at least one file or folder.");
      setStatus("error");
      return;
    }

    setLoading(true);
    try {
      const attachments = await Promise.all(
        selectedFiles.map(async ({ file, relativePath, contentType }) => {
          const dataUrl = await getBase64(file);
          const base64Value = dataUrl.split(",")[1];
          return {
            filename: relativePath,
            data: base64Value,
            contentType,
          };
        })
      );

      const response = await fetch("/api/send-files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          attachments,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message || `Files sent successfully to ${email.trim() || DEFAULT_EMAIL}.`);
        setStatus("success");
        setTimeout(() => {
          closeModal();
        }, 1800);
      } else {
        setMessage(result.error || "Failed to send files. Please try again.");
        setStatus("error");
      }
    } catch (err) {
      console.error("Send files error:", err);
      setMessage("Failed to send files. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="send-files-modal-overlay" onClick={closeModal}>
      <div className="send-files-modal" onClick={(e) => e.stopPropagation()}>
        <button className="send-files-close-btn" type="button" onClick={closeModal}>
          ✕
        </button>
        <h2>Send Files</h2>
        

        <form onSubmit={handleSubmit} className="send-files-form">
          <div className="form-group">
            <label htmlFor="sendFilesName">Name (Optional)</label>
            <input
              id="sendFilesName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="sendFilesEmail">Email (Optional)</label>
            <input
              id="sendFilesEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email {DEFAULT_EMAIL}"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="sendFilesInput">Browse Documents or Select Folder</label>
            <input
              id="sendFilesInput"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.xlsx,.xls"
              webkitdirectory="true"
              directory="true"
              disabled={loading}
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="selected-files">
              <div className="selected-files-header">
                <span>{selectedFiles.length} file(s) selected</span>
                <button type="button" onClick={clearSelectedFiles} disabled={loading}>
                  Clear
                </button>
              </div>
              <ul>
                {selectedFiles.map((item) => (
                  <li key={item.relativePath}>{item.relativePath}</li>
                ))}
              </ul>
            </div>
          )}

          {message && (
            <div className={`message ${status === "success" ? "success" : "error"}`}>
              {message}
            </div>
          )}

          <div className="send-files-actions">
            <button type="button" className="btn-cancel" onClick={closeModal} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-send" disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendFilesModal;
