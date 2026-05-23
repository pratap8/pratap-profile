import React from "react";
import "./CameraModal.css";

const CameraModal = ({
  isOpen,
  onClose,
  isCameraActive,
  onStartCamera,
  onCapturePhoto,
  onStartRandomCapture,
  onCancelCapture,
  isCapturing,
  captureCountdown,
  videoRef
}) => {
  if (!isOpen) return null;

  return (
    <div className="camera-modal-overlay" onClick={onClose}>
      <div
        className="camera-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="camera-modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>Camera Capture</h2>

        {!isCameraActive ? (
          <div className="camera-instructions">
            <div className="instructions-icon">📸</div>
            <h3>How it works:</h3>
            <ul>
              <li>Click the camera button below to start the camera</li>
              <li>Allow camera permission when prompted</li>
              <li>Your camera feed will appear on screen</li>
              <li>Click "Capture Photo" to take a screenshot</li>
              <li>The photo will be automatically downloaded</li>
            </ul>
            <button
              className="camera-modal-btn camera-start-btn"
              onClick={onStartCamera}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              Start Camera
            </button>
          </div>
        ) : (
          <div className="camera-active-wrapper">
            <div className="camera-video-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video-stream"
              />
            </div>

            {isCapturing && (
              <div className="capture-countdown">
                <div className="countdown-text">
                  Photo will capture in <strong>{captureCountdown}s</strong>
                </div>
              </div>
            )}

            <div className="camera-controls">
              {!isCapturing ? (
                <>
                  <button
                    className="camera-modal-btn capture-btn"
                    onClick={onCapturePhoto}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <circle cx="12" cy="12" r="8" />
                    </svg>
                    Capture Now
                  </button>
                  <button
                    className="camera-modal-btn random-btn"
                    onClick={onStartRandomCapture}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 2.2" />
                    </svg>
                    Random Capture
                  </button>
                </>
              ) : (
                <button
                  className="camera-modal-btn cancel-btn"
                  onClick={onCancelCapture}
                >
                  ✕ Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraModal;
