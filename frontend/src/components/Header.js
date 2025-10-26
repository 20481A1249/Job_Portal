import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  const isLoggedIn = user && (location.pathname.includes('/dashboard') || location.pathname.includes('/employer') || location.pathname.includes('/jobseeker'));

  return (
    <header className={`shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>JobPortal</Link>
        <nav className="space-x-4 flex items-center">
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
      </div>
    </header>
  );
};

export default Header;
