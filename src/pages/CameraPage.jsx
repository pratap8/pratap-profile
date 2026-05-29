import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CameraPage.css";

const CameraPage = () => {
  const navigate = useNavigate();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isRandomCapturing, setIsRandomCapturing] = useState(false);
  const [captureCountdown, setCaptureCountdown] = useState(null);
  const [showInfoPopup, setShowInfoPopup] = useState(true);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const randomCaptureTimeoutRef = useRef(null);
  const isRandomCapturingRef = useRef(false);

  // Attach stream to video when camera becomes active
  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      console.log("Attaching stream to video element");
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.error("Play error:", err);
      });
    }
  }, [isCameraActive, stream]);

  // Cleanup streams when component unmounts
  useEffect(() => {
    return () => {
      isRandomCapturingRef.current = false;
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      if (randomCaptureTimeoutRef.current) {
        clearTimeout(randomCaptureTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      console.log("Stream obtained:", mediaStream);
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err) {
      alert("Camera permission denied or not available. Please allow camera access.");
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    isRandomCapturingRef.current = false;
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log("Track stopped:", track.kind);
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    // Stop random capture if active
    if (randomCaptureTimeoutRef.current) {
      clearTimeout(randomCaptureTimeoutRef.current);
    }
    // Stop countdown interval if active
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setIsCameraActive(false);
    setIsCapturing(false);
    setIsRandomCapturing(false);
    console.log("Camera stopped");
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      ctx.drawImage(videoRef.current, 0, 0);

      const imageData = canvas.toDataURL("image/png");

      // Auto download
      const link = document.createElement("a");
      link.href = imageData;
      link.download = `captured-photo-${Date.now()}.png`;
      link.click();

      console.log("Photo captured and downloaded!");
    }
  };

  const scheduleNextRandomCapture = () => {
    // Generate random delay between 1-6 seconds for unpredictable capture timing
    // This unique feature is not available in standard camera applications
    const randomDelay = Math.floor(Math.random() * 5000) + 1000; // 1-6 seconds
    const delayInSeconds = (randomDelay / 1000).toFixed(1);

    setIsCapturing(true);
    setCaptureCountdown(delayInSeconds);

    let remainingTime = randomDelay;
    countdownIntervalRef.current = setInterval(() => {
      remainingTime -= 100;
      const secondsLeft = Math.max(0, (remainingTime / 1000).toFixed(1));
      setCaptureCountdown(secondsLeft);

      if (remainingTime <= 0) {
        clearInterval(countdownIntervalRef.current);
        capturePhoto(); // Auto-capture at random interval
        
        // Schedule next capture in sequence if random capturing is still active
        if (isRandomCapturingRef.current) {
          randomCaptureTimeoutRef.current = setTimeout(() => {
            scheduleNextRandomCapture(); // Recursively schedule next random capture
          }, 500); // 500ms buffer before scheduling next capture
        } else {
          setCaptureCountdown(null);
          setIsCapturing(false);
        }
      }
    }, 100);
  };

  // Start the continuous random capture mode
  // Photos will be captured automatically at random intervals (1-6 seconds)
  // User can stop by clicking "Stop Random Capture" or "Stop Camera"
  const startRandomCapture = () => {
    isRandomCapturingRef.current = true;
    setIsRandomCapturing(true);
    scheduleNextRandomCapture();
  };

  // Stop only the random capture sequence
  // Camera continues running so user can switch to manual capture
  const cancelRandomCapture = () => {
    isRandomCapturingRef.current = false;
    setIsRandomCapturing(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    if (randomCaptureTimeoutRef.current) {
      clearTimeout(randomCaptureTimeoutRef.current);
    }
    setIsCapturing(false);
    setCaptureCountdown(null);
    console.log("Random capture cancelled");
  };

  const handleBackToProfile = () => {
    stopCamera();
    cancelRandomCapture();
    navigate("/");
  };

  return (
    <div className="camera-page-container">
      {/* Header with back button */}
      <header className="camera-page-header">
        <button className="back-btn" onClick={handleBackToProfile}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Profile
        </button>
        <h1>Random Camera Capture</h1>
      </header>

      {/* Feature Info Popup Modal */}
      {showInfoPopup && (
        <div className="info-popup-overlay" onClick={() => setShowInfoPopup(false)}>
          <div className="info-popup-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="popup-close-btn" 
              onClick={() => setShowInfoPopup(false)}
              title="Close"
            >
              ✕
            </button>

            <div className="info-popup-content">
              <div className="info-header">
                <span className="info-icon">ℹ️</span>
                <h3>Random Capture Feature</h3>
              </div>
              <div className="info-details">
                <p><strong>🎯 What is Random Capture?</strong></p>
                <p>A feature that automatically captures photos at unpredictable random intervals (1-6 seconds). This unique feature is not available in standard camera applications!</p>
                
                <p><strong>⏱️ Timing:</strong> Photos are captured between 1 to 6 seconds randomly.</p>
                
                <p><strong>📸 How to Use:</strong></p>
                <ul className="info-list">
                  <li>1. Click <strong>"Start Camera"</strong> to activate the camera</li>
                  <li>2. Click <strong>"Start Random Capture"</strong> to begin automatic shooting</li>
                  <li>3. Photos download automatically at random intervals</li>
                  <li>4. Click <strong>"Stop Random Capture"</strong> to pause, or <strong>"Stop Camera"</strong> to stop completely</li>
                </ul>
                
                <p><strong>💡 Tips:</strong> Position yourself in frame before starting. Good lighting produces better quality photos!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main camera content */}
      <main className="camera-page-main">
        {!isCameraActive ? (
          <div className="camera-startup">
            <div className="startup-icon">📸</div>
            <h2>Welcome to Camera</h2>
            <p>Click the button below to start your camera</p>
            <div className="preview-box">
              <div className="preview-label">👤 Your face will appear here</div>
            </div>
            <button className="start-camera-btn" onClick={startCamera}>
              <svg
                width="24"
                height="24"
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
          <div className="camera-active-full">
            <div className="camera-video-wrapper">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video-full"
                onCanPlay={() => console.log("Video is now playing")}
                onError={(e) => console.error("Video error:", e)}
              />
            </div>

            {isCapturing && (
              <div className="capture-countdown-full">
                <div className="countdown-text-full">
                  Photo will capture in <strong>{captureCountdown}s</strong>
                </div>
              </div>
            )}

            <div className="camera-controls-full">
              {!isRandomCapturing ? (
                <>
                  <button
                    className="control-btn capture-now-btn"
                    onClick={capturePhoto}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <circle cx="12" cy="12" r="8" />
                    </svg>
                    <span>Capture Now</span>
                  </button>
                  <button
                    className="control-btn random-capture-btn"
                    onClick={startRandomCapture}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 2.2" />
                    </svg>
                    <span>Start Random Capture</span>
                  </button>
                </>
              ) : (
                <button
                  className="control-btn cancel-capture-btn"
                  onClick={cancelRandomCapture}
                >
                  ✕ <span>Stop Random Capture</span>
                </button>
              )}
              <button
                className="control-btn stop-camera-btn"
                onClick={stopCamera}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="4" width="12" height="16" rx="1" />
                </svg>
                <span>Stop Camera</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default CameraPage;
