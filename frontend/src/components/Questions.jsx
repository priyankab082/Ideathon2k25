// src/components/StackDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import data from "../assets/stack.json";

const Questions = () => {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const [stack, setStack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = data.stacks.find((s) => s.name === decodedName);
    setTimeout(() => {
      setStack(found);
      setLoading(false);
    }, 600);
  }, [decodedName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-xl text-blue-600">Loading questions...</div>
      </div>
    );
  }

  if (!stack) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-red-600">Stack not found!</h2>
        <p className="text-gray-500 mt-2">Please go back and select a valid stack.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <a
          href="/"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to Stacks</span>
        </a>

        {/* Stack Header */}
        <div
          className="p-8 rounded-2xl shadow-xl mb-8 text-white text-center"
          style={{
            background: `linear-gradient(135deg, ${stack.gradient}, ${stack.gradientEnd})`,
          }}
        >
          <div className="text-8xl mb-4">{stack.icon}</div>
          <h1 className="text-4xl font-bold mb-2">{stack.name}</h1>
          <p className="text-blue-100 text-lg opacity-90">{stack.description}</p>
        </div>
        {/* Playlist Section */}
{stack.playlistUrl && (
          <div className="bg-white rounded-2xl shadow-lg p-8 ">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b pb-3 border-gray-200 flex items-center">
              <span className="mr-3">▶️</span>
              Learn {stack.name}
            </h2>
            <p className="text-gray-600 mb-4">
              <strong>{stack.playlistTitle}</strong>
            </p>
            <div className="aspect-w-16 aspect-h-9 mb-4 rounded-xl overflow-hidden shadow-md">
              <iframe
                src={stack.playlistUrl}
                title={stack.playlistTitle}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-80 md:h-96 rounded-xl"
              ></iframe>
            </div>
            <p className="text-sm text-gray-500">
              Video provided by YouTube. Click inside the player to browse the full playlist.
            </p>
          </div>
        )}

        {/* Questions List */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b pb-3 border-gray-200">
            📝 Interview Questions
          </h2>
          {stack.questions.length > 0 ? (
            <div className="space-y-6">
              {stack.questions.map((q) => (
                <div
                  key={q.id}
                  className="p-5 rounded-lg bg-gray-50 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2 font-bold">
                      Q{q.id}
                    </span>
                    {q.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{q.answer}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No questions available for this stack.</p>
          )}
        </div>


        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>🎯 Ace your interview with smart preparation and learning!</p>
        </div>
      </div>
    </div>
  );
};

export default Questions;