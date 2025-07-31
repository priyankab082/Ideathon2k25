import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: 'Upload Resume',
      description: 'Upload your resume and select target companies and roles.',
      color: 'blue-500',
    },
    {
      number: 2,
      title: 'AI Analysis',
      description: 'Our AI analyzes your profile and generates personalized questions.',
      color: 'green-500',
    },
    {
      number: 3,
      title: 'Practice Interview',
      description: 'Interact with our 3D AI interviewer in realistic scenarios.',
      color: 'purple-500',
    },
    {
      number: 4,
      title: 'Get Feedback',
      description: 'Receive detailed performance analysis and improvement tips.',
      color: 'orange-500',
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <p className="text-xl mb-8">Simple steps to master your interview skills</p>
        <div className="flex justify-around">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className={`bg-${step.color} text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold mb-2`}>
                {step.number}
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;