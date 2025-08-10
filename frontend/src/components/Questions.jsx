import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import data from "../assets/stack.json";
import Header from "../priyanka/components/Header";
import Footer from "../priyanka/components/Footer";

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
      <div className="flex justify-center items-center h-64 bg-gray-50">
        <div className="animate-pulse text-xl text-blue-600 font-semibold">
          Loading questions...
        </div>
      </div>
    );
  }

  if (!stack) {
    return (
      <div className="text-center py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-red-600">❌ Stack not found!</h2>
        <p className="text-gray-500 mt-3">Please go back and select a valid stack.</p>
        <Link
          to="/"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 animate-fadeIn">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Stacks</span>
          </Link>

          {/* Stack Header */}
          <div
            className="p-8 rounded-2xl shadow-xl mb-8 text-blue-600 text-center backdrop-blur-md bg-opacity-80 transform transition hover:scale-[1.02]"
            style={{
              background: `linear-gradient(135deg, ${stack.gradient}, ${stack.gradientEnd})`,
            }}
          >
            <div className="text-8xl mb-4">{stack.icon}</div>
            <h1 className="text-4xl font-bold mb-2">{stack.name}</h1>
            <p className="text-blue-500 text-lg opacity-90">{stack.description}</p>
          </div>

          {/* Playlist Section */}
          {stack.playlistUrl && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b pb-3 border-gray-200 flex items-center">
                <span className="mr-3">▶️</span>
                Learn {stack.name}
              </h2>
              <p className="text-gray-600 mb-4 font-medium">{stack.playlistTitle}</p>
              <div className="aspect-w-16 aspect-h-9 mb-4 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                <iframe
                  src={stack.playlistUrl}
                  title={stack.playlistTitle}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-80 md:h-96 rounded-xl"
                ></iframe>
              </div>
              <p className="text-sm text-gray-500 italic">
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
                    className="p-5 rounded-lg bg-gray-50 border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all"
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
              <p className="text-gray-500 italic bg-gray-100 p-4 rounded-lg">
                No questions available for this stack.
              </p>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12 text-gray-600 font-medium">
            🎯 Ace your interview with smart preparation and continuous learning!
          </div>
        </div>
      </div>
      <Footer />

      {/* Animation Styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Questions;
