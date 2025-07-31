import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto text-center">
        <div className="text-xl bg-blue-200 px-4 py-1 rounded-full mb-4">AI-Powered Interview Preparation</div>
        <h1 className="text-5xl font-bold mb-4">
          Master Your Next Interview with <span className="text-blue-500">3D AI Interviewer</span>
        </h1>
        <p className="text-xl mb-8">
          Practice with our realistic 3D AI interviewer that analyzes your resume, generates company-specific questions, and provides real-time feedback on your performance, voice, and body language.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/dashboard" className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded">
            Start your preparation 
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;