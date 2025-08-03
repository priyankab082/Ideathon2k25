import React, { useState, useRef } from "react";

const PreInterviewForm = ({ onStartInterview }) => {
  const [userResume, setUserResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const handleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserResume((prev) => prev + " " + transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    if (!isRecording) {
      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!userResume.trim()) {
      alert("Please paste your resume.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: userResume }),
      });

      const data = await res.json();
      if (res.ok && data.questions) {
        onStartInterview(userResume, data.questions);
      } else {
        alert("Failed to generate questions: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Could not connect to the server. Is Flask running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to the Interview</h2>
        <p className="text-gray-600 mb-6">Please paste your resume or speak to record:</p>

        <div className="relative mb-4">
          <textarea
            value={userResume}
            onChange={(e) => setUserResume(e.target.value)}
            placeholder="Paste or speak your full resume here..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-sm"
          />
          <button
            type="button"
            onClick={handleMic}
            className="absolute top-2 right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
            title={isRecording ? "Stop Recording" : "Start Recording"}
          >
            {isRecording ? "🎤..." : "🎤"}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-3 text-white bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 text-lg font-semibold w-full disabled:opacity-70"
        >
          {loading ? "Generating Questions..." : "Start Interview"}
        </button>
      </div>
    </div>
  );
};

export default PreInterviewForm;
