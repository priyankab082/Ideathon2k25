import React from 'react';

const DashboardHeader = () => {
  return (
    <div className="bg-white shadow-md p-4 mb-8 rounded">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, John!</h1>
          <p className="text-gray-600">Ready for your next interview practice?</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-green-200 text-green-700 px-2 py-1 rounded">Pro Plan</span>
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;