// components/UserVideo.js
import React from "react";
import AudioVisualizer from "./AudioVisualizer";

const UserVideo = ({ videoRef, isVideoOn, isMicOn, userSpeaking }) => {
  return (
    <div className="w-full h-64 sm:h-80 bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-200/60 shadow-xl">
      {isVideoOn ? (
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-2 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-xs font-medium">Camera Off</p>
        </div>
      )}
      {userSpeaking && isMicOn && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AudioVisualizer label="You" color="blue" />
        </div>
      )}
    </div>
  );
};

export default UserVideo;