// src/components/Results.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "../priyanka/components/Header";
import Footer from "../priyanka/components/Footer";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { chatHistory } = location.state || {};

  // Prevent direct access if no chat history
  useEffect(() => {
    if (!chatHistory) {
      navigate("/", { replace: true });
    }
  }, [chatHistory, navigate]);

  if (!chatHistory) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-red-600">No chat history found. Please start an interview first.</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="w-full min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Page Header */}
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white p-6 text-center">
            <h1 className="text-3xl font-bold">Interview Summary</h1>
            <p className="opacity-90">Here is the full transcript of your session.</p>
          </div>

          {/* Chat History */}
          <div className="p-6 max-h-96 overflow-y-auto space-y-4">
            {chatHistory.length === 0 ? (
              <p className="text-gray-500 text-center">No messages were exchanged during the interview.</p>
            ) : (
              chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-3xl px-5 py-3 rounded-lg shadow-md text-sm ${
                      msg.sender === "customer"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className="text-xs opacity-80 mt-1 block">{msg.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t bg-gray-50 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Print Summary
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Results;