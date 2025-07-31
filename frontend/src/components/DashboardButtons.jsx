import React from 'react';
import { Link } from 'react-router-dom';

const DashboardButtons = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Start New Interview */}
      <div className="bg-blue-100 p-6 rounded shadow-md">
        <h2 className="text-xl font-bold text-blue-500">Start New Interview</h2>
        <p className="text-gray-600 mb-4">Practice with our 3D AI interviewer</p>
        <Link to="/start-interview" className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded w-full">
          Start Interview
        </Link>
      </div>

      {/* Upload Resume */}
      <div className="bg-green-100 p-6 rounded shadow-md">
        <h2 className="text-xl font-bold text-green-500">Upload Resume</h2>
        <p className="text-gray-600 mb-4">Update your profile for better questions</p>
        <Link to="/upload-resume" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded w-full border border-gray-400">
          Manage Profile
        </Link>
      </div>

      {/* View Reports */}
      <div className="bg-purple-100 p-6 rounded shadow-md">
        <h2 className="text-xl font-bold text-purple-500">View Reports</h2>
        <p className="text-gray-600 mb-4">Analyze your performance trends</p>
        <Link to="/view-reports" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded w-full border border-gray-400">
          View Analytics
        </Link>
      </div>
    </div>
  );
};

export default DashboardButtons;