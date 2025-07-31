import React from 'react';

const UpcomingFeatures = () => {
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Upcoming Features</h2>
      <p className="text-gray-600 mb-4">New tools coming soon</p>
      <ul className="list-disc pl-4">
        <li className="text-blue-500">Group interview simulation</li>
        <li className="text-green-500">Industry-specific questions</li>
        <li className="text-purple-500">Mock salary negotiation</li>
      </ul>
    </div>
  );
};

export default UpcomingFeatures;