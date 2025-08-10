import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20">
      <div className="container mx-auto text-center px-6">

        {/* Tagline */}
        <div className="inline-block text-sm md:text-lg bg-blue-200 px-6 py-2 rounded-full mb-6 font-medium animate-fadeIn">
          🚀 AI-Powered Interview Preparation
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-fadeIn delay-100">
          Master Your Next Interview with <br />
          <span className="text-blue-600">3D AI Interviewer</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 animate-fadeIn delay-200">
          Practice with our realistic 3D AI interviewer that analyzes your resume,
          generates company-specific questions, and provides real-time feedback
          on your performance, voice, and body language.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center space-x-4 animate-fadeIn delay-300">
          <Link
            to="/dashboard"
            className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            🎯 Start Your Preparation
          </Link>
        </div>
      </div>

      {/* Simple animation styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease forwards;
          }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
        `}
      </style>
    </section>
  );
};

export default HeroSection;
