// pages/ViewReports.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ViewReports = () => {
  // Mock data - can later come from API
  const interviewData = [
    {
      question: "Explain the difference between let, const, and var in JavaScript.",
      studentAnswer: "Var is function-scoped, let and const are block-scoped. Const can't be reassigned.",
      correctAnswer: "Var is function-scoped and can be redeclared. Let is block-scoped and can be updated but not redeclared. Const is block-scoped and cannot be reassigned or redeclared.",
      correct: false,
    },
    {
      question: "What is the Virtual DOM in React?",
      studentAnswer: "It's a lightweight copy of the real DOM that React uses to improve performance by minimizing direct updates.",
      correctAnswer: "The Virtual DOM is a lightweight in-memory representation of the real DOM. React uses it to compute the minimal set of changes needed before updating the actual DOM, improving performance.",
      correct: true,
    },
    {
      question: "How does the useEffect hook work in React?",
      studentAnswer: "It runs after render and can handle side effects like API calls.",
      correctAnswer: "useEffect is used to perform side effects in functional components. It runs after render by default, and optionally on specific dependency changes. It can also return a cleanup function.",
      correct: true,
    },
    {
      question: "What is middleware in Express.js?",
      studentAnswer: "Functions that access the request and response objects.",
      correctAnswer: "Middleware functions in Express have access to the request (req), response (res), and next middleware function. They can execute code, modify req/res, end the response cycle, or call the next middleware.",
      correct: false,
    },
    {
      question: "Explain RESTful API principles.",
      studentAnswer: "Uses HTTP methods like GET, POST, PUT, DELETE to perform CRUD operations on resources.",
      correctAnswer: "RESTful APIs use stateless communication, standard HTTP methods (GET, POST, PUT, DELETE), and resource-based URLs. They typically return JSON and follow uniform interface constraints.",
      correct: true,
    },
  ];

  // Calculate summary
  const total = interviewData.length;
  const correctCount = interviewData.filter(q => q.correct).length;
  const incorrectCount = total - correctCount;

  // Chart data
  const chartData = {
    labels: ['Correct Answers', 'Incorrect Answers'],
    datasets: [
      {
        label: 'Performance Summary',
        data: [correctCount, incorrectCount],
        backgroundColor: ['#4CAF50', '#F44336'],
        borderColor: ['#388E3C', '#D32F2F'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Interview Performance Report</h1>
        <p className="text-center text-gray-600 mb-8">Review your answers and track your progress</p>

        {/* Back to Dashboard */}
        <div className="mb-6">
          <Link to="/dashboard" className="text-blue-500 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Question Review */}
          <div className="bg-white p-6 rounded-lg shadow-md h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Question Review</h2>
            <div className="space-y-6">
              {interviewData.map((item, index) => (
                <div key={index} className="border-b pb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {index + 1}. {item.question}
                  </h3>

                  <div className="ml-4 mt-2">
                    <p className="text-sm text-gray-600 mb-1"><strong>Your Answer:</strong></p>
                    <p className={`text-sm p-2 rounded ${item.correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                      {item.studentAnswer}
                    </p>
                  </div>

                  <div className="ml-4 mt-2">
                    <p className="text-sm text-gray-600 mb-1"><strong>Correct Answer:</strong></p>
                    <p className="text-sm p-2 bg-gray-50 rounded text-gray-800">
                      {item.correctAnswer}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                      item.correct
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.correct ? 'Correct' : 'Needs Improvement'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4">Performance Summary</h2>
            <div className="w-full max-w-xs">
              <Pie data={chartData} options={chartOptions} />
            </div>
            <div className="mt-6 text-center">
              <p className="text-lg">
                <strong>{correctCount}</strong> Correct • <strong>{incorrectCount}</strong> Incorrect
              </p>
              <p className="text-gray-600 mt-1">
                Accuracy: {total > 0 ? Math.round((correctCount / total) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-2xl font-bold text-blue-500">{total}</p>
            <p className="text-gray-600">Total Questions</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-2xl font-bold text-green-500">{correctCount}</p>
            <p className="text-gray-600">Correct Answers</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-2xl font-bold text-red-500">{incorrectCount}</p>
            <p className="text-gray-600">Incorrect Answers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReports;