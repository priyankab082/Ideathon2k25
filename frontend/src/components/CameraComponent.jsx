// components/CameraComponent.jsx
import React, { useRef, useEffect, useState } from "react";

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [pose, setPose] = useState({ vertical: '---', horizontal: '---', pitch: null, yaw: null });
  const [isConnected, setIsConnected] = useState(false);
  const [interviewTime, setInterviewTime] = useState(0); // in seconds
  const [isLookingAway, setIsLookingAway] = useState(false);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Start interview timer
  useEffect(() => {
    const interval = setInterval(() => {
      setInterviewTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Setup camera and pose detection
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    let stream;

    // Request camera access
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(mediaStream => {
        stream = mediaStream;
        video.srcObject = stream;
        setIsConnected(true);
      })
      .catch(err => {
        console.error("Camera access denied:", err);
        alert("Camera access is required for the interview. Please allow camera permissions.");
        setIsConnected(false);
      });

    // Pose detection loop (every 500ms)
    const detectionInterval = setInterval(() => {
      if (!isConnected || !video || video.readyState !== 4) return;

      // Draw video frame to canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64 and send to backend
      const imageData = canvas.toDataURL('image/jpeg');
      fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
      })
        .then(res => res.json())
        .then(data => {
          if (data[0] && !data[0].error) {
            const { pitch, yaw } = data[0];
            setPose({ pitch, yaw });

            // Detect if user is looking away
            const isAway = Math.abs(yaw) > 20 || Math.abs(pitch) > 15;
            setIsLookingAway(isAway);
          }
        })
        .catch(err => {
          console.warn("Pose detection error:", err);
          // Optionally keep last known pose or ignore
        });
    }, 500);

    // Cleanup
    return () => {
      clearInterval(detectionInterval);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isConnected]);

  return (
    <div className="interview-room bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">AI Interview Session</h1>
        <div className="timer bg-black px-3 py-1 rounded text-lg">
          ⏱️ {formatTime(interviewTime)}
        </div>
      </header>

      {/* Main Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-2 h-96">
        {/* Interviewer (AI) Panel */}
        <div className="bg-gray-100 p-6 flex flex-col items-center justify-center text-center border-r border-gray-200">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 mx-auto border-4 border-gray-300">
            <img
              src="https://via.placeholder.com/150/4A90E2/FFFFFF?text=AI"
              alt="AI Interviewer"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Dr. Sarah Chen</h3>
          <p className="text-gray-600 text-sm">Senior Software Engineer</p>
          <p className="mt-2 text-gray-500 italic">"Tell me about your last project..."</p>
        </div>

        {/* Candidate (You) Panel */}
        <div className="relative bg-black flex flex-col">
          {/* Video Feed */}
          <div className="relative flex-1 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Pose Overlay */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded text-xs font-mono">
              <p>Pitch: {pose.pitch?.toFixed(1) ?? '---'}°</p>
              <p>Yaw: {pose.yaw?.toFixed(1) ?? '---'}°</p>
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {isConnected ? '🟢 Connected' : '🔴 Not Connected'}
              </span>
            </div>

            {/* Warning if looking away */}
            {isLookingAway && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-40 text-white font-bold text-lg animate-pulse">
                ⚠️ Please look at the camera!
              </div>
            )}
          </div>

          {/* Candidate Info */}
          <div className="p-3 bg-gray-900 text-white text-center text-sm">
            <h3 className="font-medium">You (Candidate)</h3>
            <p className="text-gray-300">Maintain eye contact and good posture</p>
          </div>
        </div>
      </main>

      {/* Footer / Controls */}
      <footer className="bg-gray-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-sm text-gray-600">
          🔦 Ensure good lighting and minimal background noise
        </div>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to end the interview?")) {
              alert("Interview ended. Feedback will be generated shortly.");
              // You can redirect or close session here
            }
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          End Interview
        </button>
      </footer>
    </div>
  );
};

export default CameraComponent;