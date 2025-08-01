// components/Dashboard.js
import React from "react";
import { FaUpload, FaChartBar, FaFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
const Dashboard = () => {
  // Mocked user data (replace with actual API calls later)
  const userData = {
    name: "John Doe",
    totalInterviews: 24,
    averageScore: 8.2,
    practiceTime: "12.5h",
    successRate: "85%",
    recentInterviews: [
      {
        role: "Google Software Engineer",
        type: "Technical + Behavioral",
        score: 8.5,
        duration: "25 min",
        timestamp: "2 hours ago",
      },
    ],
    weeklyGoal: {
      target: 5,
      completed: 3,
    },
  };

  return (
    <div className="max-w-screen-lg mx-auto p-8 bg-white shadow-md rounded-lg">
      {/* Welcome Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {userData.name}!</h1>
          <p className="text-gray-600">Ready for your next interview practice?</p>
        </div>
        <div>
          <button className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Pro Plan</button>
          <button className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm ml-4">Settings</button>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Start New Interview */}
        <div className="bg-blue-100 rounded-lg p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <FaFileAlt className="text-blue-700" />
            <div>
              <h2 className="text-xl font-semibold text-blue-700">Start New Interview</h2>
              <p className="text-gray-600">Practice with our 3D AI interviewer</p>
            </div>
          </div>
          <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 block w-full">
            <Link
          to="/interview-setup"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 block w-full"
        >
          Start Interview
        </Link>
          </button>
        </div>

        {/* Upload Resume */}
        <div className="bg-green-100 rounded-lg p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <FaUpload className="text-green-700" />
            <div>
              <h2 className="text-xl font-semibold text-green-700">Upload Resume</h2>
              <p className="text-gray-600">Update your profile for better questions</p>
            </div>
          </div>
          <button className="bg-white text-green-700 border border-green-300 px-6 py-3 rounded-lg hover:bg-green-100 block w-full">
            <Link
              to="/profile"
            >
              Manage Profile
            </Link>
          </button>
        </div>

        {/* View Reports */}
        <div className="bg-purple-100 rounded-lg p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <FaChartBar className="text-purple-700" />
            <div>
              <h2 className="text-xl font-semibold text-purple-700">View Reports</h2>
              <p className="text-gray-600">Analyze your performance trends</p>
            </div>
          </div>
          <button className="bg-white text-purple-700 border border-purple-300 px-6 py-3 rounded-lg hover:bg-purple-100 block w-full">
            View Analytics
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Interviews */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-gray-600 text-sm">Total Interviews</p>
              <h2 className="text-2xl font-bold">{userData.totalInterviews}</h2>
              <p className="text-xs text-gray-400">+3 from last week</p>
            </div>
            <span className="text-gray-400">📊</span>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-gray-600 text-sm">Average Score</p>
              <h2 className="text-2xl font-bold">{userData.averageScore}/10</h2>
              <p className="text-xs text-green-500">+0.5 improvement</p>
            </div>
            <span className="text-gray-400">🔍</span>
          </div>
        </div>

        {/* Practice Time */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-gray-600 text-sm">Practice Time</p>
              <h2 className="text-2xl font-bold">{userData.practiceTime}</h2>
              <p className="text-xs text-gray-400">This month</p>
            </div>
            <span className="text-gray-400">⏰</span>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-gray-600 text-sm">Success Rate</p>
              <h2 className="text-2xl font-bold">{userData.successRate}</h2>
              <p className="text-xs text-green-500">+12% from last month</p>
            </div>
            <span className="text-gray-400">📈</span>
          </div>
        </div>
      </div>

      {/* Recent Interview Sessions */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Interview Sessions</h2>
        <p className="text-gray-600 mb-4">Your latest practice sessions and performance</p>
        {userData.recentInterviews.map((session, index) => (
          <div key={index} className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FaFileAlt className="text-blue-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium">{session.role}</h3>
              <p className="text-gray-600 text-sm">{session.type}</p>
              <p className="text-gray-400 text-xs">{session.timestamp}</p>
            </div>
            <div className="ml-auto">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                {session.score}/10
              </span>
              <p className="text-gray-600 text-sm mt-1">{session.duration}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Goal */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Weekly Goal</h2>
        <p className="text-gray-600 mb-4">Complete 5 interview sessions</p>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-gray-600 text-sm">Progress</p>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full"
                style={{ width: `${(userData.weeklyGoal.completed / userData.weeklyGoal.target) * 100}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-600 text-sm">{`${userData.weeklyGoal.completed}/${userData.weeklyGoal.target} sessions`}</p>
        </div>
        <p className="text-gray-600 text-sm">
          {userData.weeklyGoal.target - userData.weeklyGoal.completed} more sessions to reach your goal!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;