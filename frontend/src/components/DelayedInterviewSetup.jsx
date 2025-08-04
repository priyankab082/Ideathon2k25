// components/DelayedInterviewSetup.js
import React, { useEffect, useState } from "react";
import InterviewSetup from "./InterviewSetup";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loadinganimation.json";

const DelayedInterviewSetup = () => {
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComponent(true);
    }, 5000); // 5 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (showComponent) {
    return <InterviewSetup />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Left Side - Lottie Animation (Desktop Only) */}
      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md lg:max-w-lg aspect-square brightness-95 contrast-105 hover:brightness-100 transition-all duration-300">
          <Lottie animationData={loadingAnimation} loop={true} />
        </div>
      </div>

      {/* Right Side - Loading Text */}
      <div className="flex w-full md:w-1/2 flex-col items-center justify-center p-6 lg:p-10 text-center space-y-6">
        <div className="max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">
            Preparing Your Interview Experience
          </h2>
          <p className="text-lg text-gray-600 mb-2">We're setting everything up for a seamless session.</p>
          <div className="flex justify-center my-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-gray-500">This won’t take long...</p>
        </div>

        {/* Optional: Progress bar or estimated time */}
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5 mt-6">
          <div className="bg-blue-600 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
        <p className="text-xs text-gray-400">Loading... </p>
      </div>
    </div>
  );
};

export default DelayedInterviewSetup;