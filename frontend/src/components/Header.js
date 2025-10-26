import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn = user && (location.pathname.includes('/dashboard') || location.pathname.includes('/employer') || location.pathname.includes('/jobseeker'));

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>JobPortal</Link>
        <nav className="hidden md:flex space-x-4 items-center">
          {!isLoggedIn && (
            <button onClick={toggleDarkMode} className={`px-3 py-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          )}
          {isLoggedIn ? (
            <>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Hello, {user.name}!</span>
              <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={`hover:${darkMode ? 'text-blue-400' : 'text-blue-600'} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Login</Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign Up</Link>
            </>
          )}
        </nav>
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className={`md:hidden ${darkMode ? 'text-white' : 'text-gray-700'} focus:outline-none`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
          </svg>
        </button>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="container mx-auto px-4 py-4 space-y-4">
            {!isLoggedIn && (
              <button onClick={toggleDarkMode} className={`w-full text-left px-3 py-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {darkMode ? '☀️' : '🌙'}
              </button>
            )}
            {isLoggedIn ? (
              <>
                <span className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Hello, {user.name}!</span>
                <button onClick={logout} className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={toggleMenu} className={`block hover:${darkMode ? 'text-blue-400' : 'text-blue-600'} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Login</Link>
                <Link to="/signup" onClick={toggleMenu} className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
