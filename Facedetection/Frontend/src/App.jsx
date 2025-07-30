// src/App.js
import React, { useRef, useEffect, useState } from 'react';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [pose, setPose] = useState({ vertical: '---', horizontal: '---' });

  useEffect(() => {
    const video = videoRef.current;

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
      })
      .catch(err => console.error("Camera access denied:", err));

    const interval = setInterval(() => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/jpeg');
      fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
      })
      .then(res => res.json())
      .then(data => {
        if (data[0] && !data[0].error) {
          setPose(data[0]);
        }
      })
      .catch(err => console.warn("No face or error"));
    }, 500); // Send every 500ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1>Head Pose Estimation</h1>

      <div className="container">
        <div className="video-container">
          <video ref={videoRef} autoPlay muted style={{ width: '100%', borderRadius: '10px' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        <div className="info-box">
          <h2>Head Orientation</h2>
          <p><strong>Vertical:</strong> {pose.vertical}</p>
          <p><strong>Horizontal:</strong> {pose.horizontal}</p>
          <p><strong>Pitch:</strong> {pose.pitch?.toFixed(1)}°</p>
          <p><strong>Yaw:</strong> {pose.yaw?.toFixed(1)}°</p>
        </div>
      </div>
    </div>
  );
}

export default App;