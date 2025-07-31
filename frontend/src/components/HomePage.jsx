// components/HomePage.jsx
import React from "react";
import {
  FaBullseye,
  FaFileAlt,
  FaUsers,
  FaChartLine,
  FaBrain,
  FaGraduationCap,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 leading-relaxed">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Ace Your Interviews with <br />
            <span className="text-teal-400">AI-Powered Mock Practice</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Realistic simulations, personalized feedback, and company-specific prep — all in one platform.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Top Candidates Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We don’t just simulate interviews — we <strong>transform your confidence</strong> and <strong>maximize your offer rate</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-teal-100 transform hover:-translate-y-1">
              <div className="text-teal-600 mb-5 bg-teal-100 w-14 h-14 rounded-full flex items-center justify-center">
                <FaBullseye size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                Company-Specific Simulations
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Practice with real questions from Google, Amazon, and more. Get familiar with actual interview formats and behavioral expectations.
              </p>
              <div className="mt-4 flex items-center text-teal-600">
                <FaCheckCircle className="mr-2" /> Role-based scenarios
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-blue-100 transform hover:-translate-y-1">
              <div className="text-blue-600 mb-5 bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center">
                <FaFileAlt size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                Resume-Aware Questioning
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Our AI reads your resume and asks deep-dive questions about your projects, tech stack, and experience — just like real hiring managers.
              </p>
              <div className="mt-4 flex items-center text-blue-600">
                <FaCheckCircle className="mr-2" /> Personalized prep
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-purple-100 transform hover:-translate-y-1">
              <div className="text-purple-600 mb-5 bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center">
                <FaUsers size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                Soft Skill Evaluation
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Get scored on tone, clarity, confidence, and body language — not just technical answers.
              </p>
              <div className="mt-4 flex items-center text-purple-600">
                <FaCheckCircle className="mr-2" /> Video & audio feedback
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-green-100 transform hover:-translate-y-1">
              <div className="text-green-600 mb-5 bg-green-100 w-14 h-14 rounded-full flex items-center justify-center">
                <FaChartLine size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                Holistic Feedback System
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Receive a detailed performance score across technical, behavioral, and emotional dimensions — with actionable insights.
              </p>
              <div className="mt-4 flex items-center text-green-600">
                <FaCheckCircle className="mr-2" /> Scorecard + tips
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-orange-100 transform hover:-translate-y-1">
              <div className="text-orange-600 mb-5 bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center">
                <FaBrain size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                Adaptive Learning
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The more you practice, the smarter we get. We adapt to your strengths and weaknesses.
              </p>
              <div className="mt-4 flex items-center text-orange-600">
                <FaCheckCircle className="mr-2" /> Personalized roadmap
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-indigo-100 transform hover:-translate-y-1">
              <div className="text-indigo-600 mb-5 bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center">
                <FaGraduationCap size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                Real-World Readiness
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Go beyond LeetCode. Prepare for real conversations, pressure, and follow-up questions.
              </p>
              <div className="mt-4 flex items-center text-indigo-600">
                <FaCheckCircle className="mr-2" /> Industry-aligned prep
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New: Center "Start" Button */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Fill out your profile and start practicing with AI-powered mock interviews tailored to your dream job.
          </p>
          <Link
            to="/profile"
            className="inline-block bg-black text-white text-xl font-bold px-10 py-4 rounded-full hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
          >
            Start
          </Link>
        </div>
      </section>

      {/* Testimonial (Optional, kept for trust but simplified) */}
      <section className="bg-gray-100 py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-xl italic text-gray-700">
            “After just one week of practice, I felt completely ready for my on-site interviews.”
          </blockquote>
          <cite className="text-lg font-semibold text-teal-600">— A Confident Candidate</cite>
        </div>
      </section>
    </div>
  );
};

export default HomePage;