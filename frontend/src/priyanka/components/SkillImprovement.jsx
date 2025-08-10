import React from 'react';

const SkillImprovement = () => {
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Weekly Goal</h2>
      <p className="text-gray-600 mb-4">Complete 5 interview sessions</p>
      <div className="bg-gray-200 rounded-full h-4 mb-4">
        <div className="bg-black rounded-full h-4" style={{ width: "60%" }}></div>
      </div>
      <p className="text-gray-600">Progress: 3/5 sessions<br />2 more sessions to reach your goal!</p>
      <h2 className="text-xl font-bold mt-8">Skill Improvement</h2>
      <p className="text-gray-600 mb-4">Areas you're working on</p>
      <div>
        <div className="flex justify-between mb-2">
          <p>Communication</p>
          <p>85%</p>
        </div>
        <div className="bg-gray-200 rounded-full h-4">
          <div className="bg-black rounded-full h-4" style={{ width: "85%" }}></div>
        </div>
        <div className="flex justify-between mb-2 mt-2">
          <p>Technical Skills</p>
          <p>78%</p>
        </div>
        <div className="bg-gray-200 rounded-full h-4">
          <div className="bg-black rounded-full h-4" style={{ width: "78%" }}></div>
        </div>
        <div className="flex justify-between mb-2 mt-2">
          <p>Confidence</p>
          <p>72%</p>
        </div>
        <div className="bg-gray-200 rounded-full h-4">
          <div className="bg-black rounded-full h-4" style={{ width: "72%" }}></div>
        </div>
      </div>
    </div>
  );
};

export default SkillImprovement;