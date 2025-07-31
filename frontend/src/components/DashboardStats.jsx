import React from 'react';

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Interviews */}
      <div className="bg-white p-4 rounded shadow-md">
        <p className="text-gray-600">Total Interviews</p>
        <h2 className="text-2xl font-bold">24</h2>
        <p className="text-gray-500">+3 from last week</p>
      </div>

      {/* Average Score */}
      <div className="bg-white p-4 rounded shadow-md">
        <p className="text-gray-600">Average Score</p>
        <h2 className="text-2xl font-bold">8.2/10</h2>
        <p className="text-gray-500">+0.5 improvement</p>
      </div>

      {/* Practice Time */}
      <div className="bg-white p-4 rounded shadow-md">
        <p className="text-gray-600">Practice Time</p>
        <h2 className="text-2xl font-bold">12.5h</h2>
        <p className="text-gray-500">This month</p>
      </div>

      {/* Success Rate */}
      <div className="bg-white p-4 rounded shadow-md">
        <p className="text-gray-600">Success Rate</p>
        <h2 className="text-2xl font-bold">85%</h2>
        <p className="text-gray-500">+12% from last month</p>
      </div>
    </div>
  );
};

export default DashboardStats;