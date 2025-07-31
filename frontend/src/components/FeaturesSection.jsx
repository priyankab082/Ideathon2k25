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
    <section className="bg-white py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Comprehensive Interview Preparation</h2>
        <p className="text-xl mb-8">
          Our AI-powered platform combines cutting-edge technology to give you the most realistic interview practice experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="bg-white shadow-md p-4 rounded">
              <div className="text-2xl text-blue-500">{feature.icon}</div>
              <h3 className="text-xl font-bold mt-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;