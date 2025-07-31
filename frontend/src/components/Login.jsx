import React, { useState } from 'react';
import Lottie from 'lottie-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import loginanimation from '../assets/loginanimation.json';

// React Icons
import { FaUser, FaLock } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = { email, password };

    try {
const response = await axios.post(`${API_URL}/login`, loginData);

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('name', response.data.user.name);
      localStorage.setItem('email', response.data.user.email);
      localStorage.setItem('number', response.data.user.number);
      localStorage.setItem('userId', response.data.user._id);

      if (response.data.user.referred && Array.isArray(response.data.user.referred)) {
        localStorage.setItem('referred', JSON.stringify(response.data.user.referred));
      }
navigate('/'); 
    
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response) {
        alert('Login failed: ' + error.response.data.message);
      } else {
        alert('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-white">
      {/* Left Side - Lottie Animation (Hidden on small screens) */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-12 ">
        <div className="w-full h-full max-w-lg max-h-lg brightness-92 contrast-110">
          <Lottie animationData={loginanimation} loop={true} />
        </div>
      </div>

      {/* Right Side - Login Form (Full width on small screens) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-8 transition-all duration-300">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="absolute inset-y-0 left-0 top-7 pl-3 flex items-center pointer-events-none text-gray-500">
                <FaUser />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="absolute inset-y-0 left-0 top-7 pl-3 flex items-center pointer-events-none text-gray-500">
                <FaLock />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
            >
              Login
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-5 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline font-medium">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;