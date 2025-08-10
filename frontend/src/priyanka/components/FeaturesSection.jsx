import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      icon: '📄',
      title: 'Resume-Aware Questions',
      description: 'AI analyzes your resume and generates personalized questions based on your skills and experience.',
    },
    {
      icon: '📊',
      title: 'Company-Specific Simulation',
      description: 'Practice with interview patterns from top companies like Google, Microsoft, Amazon, and more.',
    },
    {
      icon: '👤',
      title: '3D AI Interviewer',
      description: 'Interact with a realistic 3D interviewer that maintains eye contact and responds naturally.',
    },
    {
      icon: '🎤',
      title: 'Voice Analysis',
      description: 'Real-time feedback on speech pace, clarity, tone, and filler words to improve communication.',
    },
    {
      icon: '👁️',
      title: 'Emotion & Facial Analysis',
      description: 'Advanced computer vision analyzes eye contact, expressions, and stress levels during interviews.',
    },
    {
      icon: '📊',
      title: 'Detailed Performance Reports',
      description: 'Comprehensive feedback with improvement suggestions and model answers for better preparation.',
    },
  ];

  return (
    <section className="bg-gradient-to-br from-white via-blue-50 to-blue-100 py-20">
      <div className="container mx-auto text-center px-6">

        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 animate-fadeIn">
          Comprehensive Interview Preparation
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 animate-fadeIn delay-100">
          Our AI-powered platform combines cutting-edge technology to give you the most realistic interview practice experience.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
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

export default FeaturesSection;
