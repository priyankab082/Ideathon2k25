// src/components/Stack.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import data from "../assets/stack.json";

const Stack = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-xl text-blue-600">Loading stacks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 tracking-tight">
            🚀 Tech Stacks
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a stack to explore interview questions and level up your prep.
          </p>
        </div>

        {/* Stacks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.stacks.map((stack) => (
            <Link
              to={`/stack/${encodeURIComponent(stack.name)}`}
              key={stack.name}
              className="group block"
            >
              <div
                className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${stack.gradient || "rgba(59, 130, 246, 0.8)"}, ${stack.gradientEnd || "rgba(37, 99, 235, 0.9)"})`,
                }}
              >
                <div className="p-8 text-white text-center">
                  <div className="text-6xl mb-4 group-hover:animate-bounce transition-transform duration-300">
                    {stack.icon}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{stack.name}</h2>
                  <p className="text-blue-100 text-sm opacity-90 line-clamp-2">
                    {stack.description}
                  </p>
                  <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                    <span className="text-blue-900">Explore Questions</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16 text-gray-500">
          <p>✨ Click on any stack to dive into interview questions.</p>
        </div>
      </div>
    </div>
  );
};

export default Stack;