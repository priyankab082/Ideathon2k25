// components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">

        {/* Logo */}
        <div className="text-2xl font-extrabold text-blue-600">
          {/* <img src="\BACK.jpg" className="w-10 h-10"></img> */}
          InterviewPrep
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 font-medium">
          <li>
            <Link to="/Home" className="relative hover:text-blue-600 transition duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/features" className="relative hover:text-blue-600 transition duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300">
              Features
            </Link>
          </li>
          <li>
            <Link to="/search" className="relative hover:text-blue-600 transition duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300">
              Searches
            </Link>
          </li>
          <li>
            <Link to="/stack" className="relative hover:text-blue-600 transition duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300">
              Stack
            </Link>
          </li>
          <li>
            <Link to="/how-it-works" className="relative hover:text-blue-600 transition duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300">
              How It Works
            </Link>
          </li>
          <li>
            <Link to="/about" className="relative hover:text-blue-600 transition duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300">
              About
            </Link>
          </li>
        </ul>

        {/* Login Button */}
        <Link to="/login" className="hidden md:block">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300">
            Login
          </button>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-blue-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-white shadow-md rounded-lg p-4 space-y-4">
          <Link to="/features" className="block text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link to="/how-it-works" className="block text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link to="/about" className="block text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/login" className="block bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700" onClick={() => setMenuOpen(false)}>Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Header;
