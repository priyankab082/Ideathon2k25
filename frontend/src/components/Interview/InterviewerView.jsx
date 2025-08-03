// components/InterviewerView.js
import React from "react";
import AudioVisualizer from "./AudioVisualizer";

const InterviewerView = ({ interviewerSpeaking }) => {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200/60 shadow-xl h-full">
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
  );
};

export default InterviewerView;