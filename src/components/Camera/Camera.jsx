import React, { useState, useRef, useEffect } from "react";
import "./Camera.css";
import CameraModal from "./CameraModal";

const Camera = ({ isModalOpen, setIsModalOpen }) => {
  const [showModal, setShowModal] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureCountdown, setCaptureCountdown] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Use external state if provided, otherwise use internal state
  const modalOpen = isModalOpen !== undefined ? isModalOpen : showModal;
  const setModalOpen = setIsModalOpen || setShowModal;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Ensure video plays
        videoRef.current.play().catch(err => {
          console.log("Auto-play prevented:", err);
        });
        setIsCameraActive(true);
      }
    } catch (err) {
      alert("Camera permission denied or not available");
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
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

      alert("Photo captured and downloaded!");
    }
  };

  const startRandomCapture = () => {
    // Random delay between 3 and 10 seconds (3000-10000 ms)
    const randomDelay = Math.floor(Math.random() * 7000) + 3000;
    const delayInSeconds = (randomDelay / 1000).toFixed(1);

    setIsCapturing(true);
    setCaptureCountdown(delayInSeconds);

    // Update countdown every 100ms for smooth display
    let remainingTime = randomDelay;
    countdownIntervalRef.current = setInterval(() => {
      remainingTime -= 100;
      const secondsLeft = Math.max(0, (remainingTime / 1000).toFixed(1));
      setCaptureCountdown(secondsLeft);

      if (remainingTime <= 0) {
        clearInterval(countdownIntervalRef.current);
        capturePhoto();
        setCaptureCountdown(null);
        setIsCapturing(false);
      }
    }, 100);
  };

  const cancelCapture = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setIsCapturing(false);
    setCaptureCountdown(null);
  };

  const handleCloseModal = () => {
    cancelCapture();
    stopCamera();
    setModalOpen(false);
  };

  return (
    <>
      {/* Floating Camera Button */}
      <button
        className="floating-camera-btn"
        onClick={() => setModalOpen(true)}
        title="Open Camera"
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
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
      </button>

      {/* Camera Modal */}
      <CameraModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        isCameraActive={isCameraActive}
        onStartCamera={startCamera}
        onCapturePhoto={capturePhoto}
        onStartRandomCapture={startRandomCapture}
        onCancelCapture={cancelCapture}
        isCapturing={isCapturing}
        captureCountdown={captureCountdown}
        videoRef={videoRef}
      />

      {/* Hidden Canvas for Photo Capture */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </>
  );
};

export default Camera;
