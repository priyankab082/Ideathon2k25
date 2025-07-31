import React from 'react';

const RecentInterviewSessions = () => {
  const sessions = [
    {
      company: "Google Software Engineer",
      type: "Technical + Behavioral",
      score: 8.5,
      duration: "25 min",
      timestamp: "2 hours ago",
    },
    {
      company: "Microsoft Product Manager",
      type: "Case Study + Leadership",
      score: 7.8,
      duration: "32 min",
      timestamp: "Yesterday",
    },
    {
      company: "Amazon Data Scientist",
      type: "Technical + Behavioral",
      score: 9.1,
      duration: "28 min",
      timestamp: "3 days ago",
    },
  ];

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Recent Interview Sessions</h2>
      <p className="text-gray-600 mb-4">Your latest practice sessions and performance</p>
      <div>
        {sessions.map((session, index) => (
          <div key={index} className="bg-white p-4 mb-2 rounded shadow-inner">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">{session.company}</h3>
                <p className="text-gray-600">{session.type}</p>
                <p className="text-gray-500">{session.timestamp}</p>
              </div>
              <div className="bg-green-200 text-green-700 px-2 py-1 rounded">
                {session.score}/10
              </div>
            </div>
            <p className="text-gray-600 mt-2">{session.duration}</p>
          </div>
        ))}
        <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded block mx-auto">
          View All Sessions
        </button>
      </div>
    </div>
  );
};

export default RecentInterviewSessions;