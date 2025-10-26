import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Hero = () => {
  const { darkMode } = useTheme();

  return (
    <section className={`py-12 sm:py-16 md:py-20 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'}`}>
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Find Your Dream Job</h1>
        <p className="text-lg sm:text-xl mb-6 sm:mb-8">Connect with top employers and discover opportunities that match your skills</p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/signup" className={`px-6 sm:px-8 py-3 rounded-lg font-semibold text-center ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-blue-600 hover:bg-gray-100'}`}>Get Started</Link>
          <Link to="/login" className={`px-6 sm:px-8 py-3 rounded-lg font-semibold border-2 text-center ${darkMode ? 'border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-800' : 'border-white text-white hover:bg-white hover:text-blue-600'}`}>Sign In</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
