import React from 'react';
import { FaCog, FaCrown } from 'react-icons/fa';

const DashboardHeader = () => {
  return (
    <div className="bg-gradient-to-r from-white via-blue-50 to-white shadow-md p-6 mb-8 rounded-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

        {/* Left: Welcome Message */}
        <div className="flex items-center space-x-4">
          <img
            src="https://i.pravatar.cc/50"
            alt="User Avatar"
            className="w-14 h-14 rounded-full shadow-md"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, John!
            </h1>
            <p className="text-gray-600">
              Ready for your next interview practice?
            </p>
          </div>
        </div>

        {/* Right: Plan & Settings */}
        <div className="flex items-center space-x-4">
          {/* <span className="flex items-center gap-2 bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-full text-sm shadow-sm">
            <FaCrown className="text-yellow-500" /> Pro Plan
          </span> */}
          <button className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition">
            <FaCog /> Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
