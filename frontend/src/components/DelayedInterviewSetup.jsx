// components/DelayedInterviewSetup.js
import React, { useEffect, useState } from "react";
import InterviewSetup from "./InterviewSetup"; // update path if needed

const DelayedInterviewSetup = () => {
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComponent(true);
    }, 5000); // 5 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return showComponent ? (
    <InterviewSetup />
  ) : (
    <div className="flex items-center justify-center h-screen bg-white">
      <p className="text-lg font-semibold text-gray-700 animate-pulse">Loading Interview Setup...</p>
    </div>
  );
};

export default DelayedInterviewSetup;
