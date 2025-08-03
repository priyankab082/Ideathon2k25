// components/InterviewSetup.js
import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPaperPlane } from "react-icons/fa";

const InterviewSetup = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [interviewerSpeaking, setInterviewerSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "interviewer",
      content: "Hello! Welcome to your interview session.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [mediaStream, setMediaStream] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [snackbar, setSnackbar] = useState({ show: false, message: "" });
  const [snackbarTimeout, setSnackbarTimeout] = useState(null);
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const dataArrayRef = useRef(null);
  const messagesEndRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Show snackbar with auto-hide
  const showSnackbar = (msg) => {
    if (snackbarTimeout) clearTimeout(snackbarTimeout);
    setSnackbar({ show: true, message: msg });
    const id = setTimeout(() => setSnackbar({ show: false, message: "" }), 5000);
    setSnackbarTimeout(id);
  };

  // Request camera & mic access
  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMediaStream(stream);
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.error("Video play error:", e));
        }

        // Audio context for visualization
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyserNode = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyserNode);
        analyserNode.fftSize = 128;
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        audioContextRef.current = audioCtx;
        setAnalyser(analyserNode);
        dataArrayRef.current = dataArray;

        const visualize = () => {
          if (!analyserNode || !dataArrayRef.current) return;
          analyserNode.getByteFrequencyData(dataArrayRef.current);
          const volume = dataArrayRef.current.reduce((a, b) => a + b) / bufferLength;
          setUserSpeaking(volume > 50);
          requestAnimationFrame(visualize);
        };
        visualize();

        // Send video frame to Flask for face detection
        const sendFrameToFlask = () => {
          if (!videoRef.current?.videoWidth || !videoRef.current?.videoHeight) return;
          const canvas = document.createElement("canvas");
          const video = videoRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append("image", blob, "frame.jpg");
            try {
              const res = await fetch("http://localhost:5000/detect-face", {
                method: "POST",
                body: formData,
              });
              const data = await res.json();
              if (data.message) {
                showSnackbar(data.message);
              }
            } catch (err) {
              console.error("Error sending frame to Flask:", err);
            }
          }, "image/jpeg");
        };

        const detectionInterval = setInterval(sendFrameToFlask, 2000);

        // Simulate interviewer speaking
        const speakingInterval = setInterval(() => {
          setInterviewerSpeaking((prev) => !prev);
        }, 3000);

        // Cleanup
        return () => {
          clearInterval(detectionInterval);
          clearInterval(speakingInterval);
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          }
          if (audioContextRef.current) {
            audioContextRef.current.close();
          }
        };
      } catch (err) {
        console.error("Error accessing media devices:", err);
        alert("Please allow camera and microphone permissions.");
      }
    };
    getMedia();
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const newMessage = {
      sender: "customer",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
  };

  const toggleMic = () => {
    if (!mediaStream) return;
    mediaStream.getAudioTracks().forEach((track) => {
      track.enabled = !isMicOn;
    });
    setIsMicOn(!isMicOn);
  };

  const toggleVideo = () => {
    if (!mediaStream) return;
    const videoTracks = mediaStream.getVideoTracks();
    if (videoTracks.length === 0) return;
    setIsVideoOn((prev) => {
      const newVideoState = !prev;
      videoTracks.forEach((track) => {
        track.enabled = newVideoState;
      });
      if (newVideoState && videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((e) => console.error("Error playing video:", e));
      }
      return newVideoState;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Keyboard Shortcuts: Ctrl+D (mic), Ctrl+E (video)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (!isCtrlOrCmd) return;
      e.preventDefault();
      if (e.key.toLowerCase() === "d") toggleMic();
      else if (e.key.toLowerCase() === "e") toggleVideo();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleMic, toggleVideo]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800 flex flex-col relative font-sans">
      {/* Title */}
      <div className="p-5 text-center border-b border-gray-200/50 shadow-sm bg-white/80 backdrop-blur-md">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Interview Room
        </h1>
      </div>

      {/* Grid Layout */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-5 p-5">
        {/* Interviewer */}
        <div className="col-span-1 sm:col-span-3 row-span-3 bg-white/70 backdrop-blur-lg rounded-2xl overflow-hidden flex items-center justify-center relative border border-gray-200/60 shadow-xl">
          {interviewerSpeaking ? (
            <AudioVisualizer label="Interviewer" color="green" />
          ) : (
            <div className="text-center text-gray-500">
              <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center border border-gray-300 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-10 h-10 text-gray-500" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-2.82 0-5.18-1.33-6.26-3.16l-.89 1.25C5.94 10.13 8.11 11 10.31 11c2.08 0 3.98-.84 5.31-2.19l-.89-1.25c-1.08 1.83-3.44 3.16-6.26 3.16z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600">Interviewer</p>
            </div>
          )}
        </div>

        {/* User Video */}
        <div className="w-140 h-80 row-span-2 col-start-4 md:col-start-4 bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-200/60 shadow-xl">
          {isVideoOn ? (
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FaVideoSlash className="w-10 h-10 mb-2 text-gray-400" />
              <p className="text-xs font-medium">Camera Off</p>
            </div>
          )}
          {userSpeaking && isMicOn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <AudioVisualizer label="You" color="blue" />
            </div>
          )}
        </div>

        {/* Chat Box */}
        <div className="col-span-1 sm:col-span-3 md:col-span-2 row-span-2 col-start-1 md:col-start-4 row-start-5 md:row-start-3 bg-white/80 backdrop-blur-lg rounded-2xl flex flex-col border border-gray-200/60 shadow-xl">
          {/* Header */}
          <div className="p-3 border-b border-gray-200/50">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              💬 <span>Live Chat</span>
            </h3>
          </div>
          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 max-h-60 sm:max-h-80" style={{ contain: 'layout' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl leading-tight break-words ${
                  msg.sender === "customer"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto shadow-md"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word', hyphens: 'auto' }}
              >
                <p className="whitespace-pre-wrap m-0 leading-relaxed">{msg.content}</p>
                <span className="text-xs block mt-1 opacity-80">{msg.timestamp}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <div className="p-3 border-t border-gray-200/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-gray-50 border border-gray-300/70 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 placeholder-gray-400 truncate"
                maxLength={200}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-full p-2 text-sm transition-all shadow-md hover:shadow-lg active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
              >
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mic & Video Buttons */}
        <div className="absolute bottom-6 left-9 z-10 flex gap-3">
          <button
            onClick={toggleMic}
            className={`flex items-center justify-center rounded-full w-14 h-14 sm:w-16 sm:h-16 transition-all duration-200 hover:scale-105 ${
              isMicOn ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-400"
            }`}
            title="Toggle Microphone (Ctrl+D)"
          >
            {isMicOn ? <FaMicrophone className="w-6 h-6" /> : <FaMicrophoneSlash className="w-6 h-6" />}
          </button>
          <button
            onClick={toggleVideo}
            className={`flex items-center justify-center rounded-full w-14 h-14 sm:w-16 sm:h-16 transition-all duration-200 hover:scale-105 ${
              isVideoOn ? "bg-blue-100 text-blue-500" : "bg-gray-100 text-gray-400"
            }`}
            title="Toggle Video (Ctrl+E)"
          >
            {isVideoOn ? <FaVideo className="w-6 h-6" /> : <FaVideoSlash className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Shortcut Tooltip */}
      <div className="absolute top-5 right-5 bg-white/90 text-gray-700 px-4 py-2 rounded-full shadow-lg text-xs backdrop-blur-sm hidden sm:block">
        <span className="font-medium">⌨️</span>
        <kbd className="px-2 py-1 mx-1 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl+D</kbd>
        <span className="mx-1">|</span>
        <kbd className="px-2 py-1 mx-1 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl+E</kbd>
      </div>

      {/* Snackbar - Top Right */}
      {snackbar.show && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in-up transition-all duration-300 ease-in-out pointer-events-none">
          <div className="px-4 py-3 rounded-lg shadow-lg text-sm max-w-xs bg-red-500 text-white">
            {snackbar.message}
          </div>
        </div>
      )}

      {/* Global Animation for Snackbar */}
      {(() => {
        const style = document.getElementById("snackbar-styles");
        if (!style) {
          const s = document.createElement("style");
          s.id = "snackbar-styles";
          s.textContent = `
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-in-up {
              animation: fadeInUp 0.3s ease-out forwards;
            }
          `;
          document.head.appendChild(s);
        }
      })()}
    </div>
  );
};

// Audio Visualizer Component
const AudioVisualizer = ({ label, color = "blue" }) => {
  const bars = Array(4).fill(0);
  const colorMap = { blue: "#3b82f6", green: "#22c55e" };
  const barColor = colorMap[color] || "#3b82f6";
  return (
    <div className="flex flex-col items-center justify-center h-full text-sm">
      <div className="flex space-x-1 mb-2">
        {bars.map((_, i) => (
          <div
            key={i}
            style={{
              width: "5px",
              backgroundColor: barColor,
              borderRadius: "4px",
              height: `${Math.floor(Math.random() * 20) + 8}px`,
              animation: `pulse 0.5s ease-in-out infinite ${i * 0.12}s`,
            }}
            className="origin-bottom"
          />
        ))}
      </div>
      <span className="font-semibold text-gray-700 bg-white/70 px-2 py-1 rounded-full text-xs shadow-sm">
        {label}
      </span>
    </div>
  );
};

// Add global animation for visualizer
if (!document.getElementById("pulse-animation-style")) {
  const style = document.createElement("style");
  style.id = "pulse-animation-style";
  style.textContent = `
    @keyframes pulse {
      0%, 100% { transform: scaleY(1); }
      50% { transform: scaleY(1.8); }
    }
  `;
  document.head.appendChild(style);
}

export default InterviewSetup;