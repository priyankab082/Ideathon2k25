// components/InterviewSetup.js
import React, { useState } from "react";
import CameraComponent from "./CameraComponent";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const InterviewSetup = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [messages, setMessages] = useState([
    {
      sender: "interviewer",
      content: "Hello! Welcome to your interview session.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      sender: "customer",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  const handleStream = (stream) => {
    console.log("Camera stream:", stream ? "active" : "stopped");
    // You can analyze stream here (e.g., for video quality)
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      {/* Header */}
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Interview Setup
      </h1>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interviewer Side */}
        <div className="bg-gray-100 rounded-xl p-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-300 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-gray-600">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Interviewer</h2>
          <p className="text-gray-600 mt-2">Waiting for connection...</p>
        </div>

        {/* Customer Side */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Camera</h2>

          {/* Camera Component */}
          <CameraComponent onStream={handleStream} />

          {/* Microphone Control */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                isMicOn ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
              {isMicOn ? "Microphone On" : "Microphone Muted"}
            </button>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="mt-8 bg-white rounded-xl shadow-md border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Chat with Interviewer</h3>
        </div>

        {/* Messages */}
        <div className="p-4 h-60 overflow-y-auto space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  msg.sender === "interviewer"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-blue-500 text-white"
                }`}
              >
                <p>{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.sender === "customer" ? "text-blue-100" : "text-gray-500"}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your response..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;