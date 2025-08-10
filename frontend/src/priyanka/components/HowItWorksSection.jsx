import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: 'Upload Resume',
      description: 'Upload your resume and select target companies and roles.',
      color: '#3B82F6', // blue-500
    },
    {
      number: 2,
      title: 'AI Analysis',
      description: 'Our AI analyzes your profile and generates personalized questions.',
      color: '#22C55E', // green-500
    },
    {
      number: 3,
      title: 'Practice Interview',
      description: 'Interact with our 3D AI interviewer in realistic scenarios.',
      color: '#8B5CF6', // purple-500
    },
    {
      number: 4,
      title: 'Get Feedback',
      description: 'Receive detailed performance analysis and improvement tips.',
      color: '#F97316', // orange-500
    },
  ];

  return (
    <section className="bg-gradient-to-br from-white via-blue-50 to-blue-100 py-20">
      <div className="container mx-auto text-center px-6">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 animate-fadeIn">
          How It Works
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-12 animate-fadeIn delay-100">
          Simple steps to master your interview skills
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fadeIn"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div
                className="rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-md"
                style={{ backgroundColor: step.color, color: 'white' }}
              >
                {step.number}
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Animation styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease forwards;
          }
          .delay-100 { animation-delay: 0.1s; }
        `}
      </style>
    </section>
  );
};

export default HowItWorksSection;
