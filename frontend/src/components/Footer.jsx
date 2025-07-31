import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div>
          <img src="/logo.png" alt="Logo" className="w-10 h-10 mr-2 inline" />
          <span className="text-xl font-bold">InterviewPrep</span>
          <p className="text-sm mt-2">
            Empowering job seekers with AI-powered interview preparation.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <h4 className="text-xl font-bold mb-2">Product</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-500">Features</a></li>
            <li><a href="#" className="hover:text-blue-500">Demo</a></li>
          </ul>
        </div>
        <div className="mt-4 md:mt-0">
          <h4 className="text-xl font-bold mb-2">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-500">About</a></li>
            <li><a href="#" className="hover:text-blue-500">Contact</a></li>
            <li><a href="#" className="hover:text-blue-500">Careers</a></li>
          </ul>
        </div>
        <div className="mt-4 md:mt-0">
          <h4 className="text-xl font-bold mb-2">Support</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-500">Help Center</a></li>
            <li><a href="#" className="hover:text-blue-500">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-500">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-600 my-4"></div>
      <div className="text-center text-gray-400">
        © 2024 InterviewPrep. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;