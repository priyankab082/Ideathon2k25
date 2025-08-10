import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo & About */}
        <div>
          <div className="flex items-center mb-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 mr-2" />
            <span className="text-2xl font-bold">InterviewPrep</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Empowering job seekers with AI-powered interview preparation.
          </p>
          {/* Social Media */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-blue-500 transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-blue-400 transition"><FaTwitter /></a>
            <a href="#" className="hover:text-blue-600 transition"><FaLinkedinIn /></a>
            <a href="#" className="hover:text-pink-500 transition"><FaInstagram /></a>
          </div>
        </div>

        {/* Product Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-blue-500 transition">Features</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Demo</a></li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-blue-500 transition">About</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Contact</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Careers</a></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-blue-500 transition">Help Center</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-6"></div>

      {/* Bottom Text */}
      <div className="text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} InterviewPrep. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
