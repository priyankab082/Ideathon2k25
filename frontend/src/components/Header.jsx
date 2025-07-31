// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="bg-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-500">InterviewPrep</div>
        <ul className="flex space-x-6">
          <li><Link to="/features" className="hover:text-blue-500">Features</Link></li>
          <li><Link to="/how-it-works" className="hover:text-blue-500">How It Works</Link></li>
          <li><Link to="/about" className="hover:text-blue-500">About</Link></li>
        </ul>
        <Link to="/login">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Header;