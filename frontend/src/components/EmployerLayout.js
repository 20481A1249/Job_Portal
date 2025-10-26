import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const EmployerLayout = () => {
  const { logout, user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log('EmployerLayout user:', user);
  console.log('EmployerLayout user.profile:', user?.profile);
  console.log('EmployerLayout user.profile.logo:', user?.profile?.logo);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Mobile/Tablet Sidebar Overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
        <div className={`absolute top-0 left-0 w-64 h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg flex flex-col`}>
          <div className="p-6 flex-1">
            <div className="mb-6 flex items-center">
              {user?.profile?.logo ? (
                <img
                  src={`https://job-portal-backend-njv6.onrender.com${user.profile.logo}`}
                  alt="Profile"
                  className="w-14 h-14 rounded-full mr-4 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full mr-4 bg-gray-300"></div>
              )}
              <div>
                <h3 className="text-lg font-semibold">Hello, {user?.name || 'Employer'}!</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Welcome back</p>
              </div>
            </div>
            <nav className="space-y-4">
              <Link
                to="/employer/dashboard"
                className={`block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                onClick={() => setSidebarOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/employer/create-job"
                className={`block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                onClick={() => setSidebarOpen(false)}
              >
                Create Job
              </Link>
              <Link
                to="/employer/manage-jobs"
                className={`block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                onClick={() => setSidebarOpen(false)}
              >
                Manage Jobs
              </Link>
              <Link
                to="/employer/profile"
                className={`block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                onClick={() => setSidebarOpen(false)}
              >
                Profile
              </Link>
            </nav>
          </div>
          <div className="p-6">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg flex-col`}>
        <div className="p-6 flex-1">
          <div className="mb-6 flex items-center">
            {user?.profile?.logo ? (
              <img
                src={`https://job-portal-backend-njv6.onrender.com${user.profile.logo}`}
                alt="Profile"
                className="w-14 h-14 rounded-full mr-4 object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full mr-4 bg-gray-300"></div>
            )}
            <div>
              <h3 className="text-lg font-semibold">Hello, {user?.name || 'Employer'}!</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Welcome back</p>
            </div>
          </div>
          <nav className="space-y-4">
            <Link
              to="/employer/dashboard"
              className={`block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Dashboard
            </Link>
            <Link
              to="/employer/create-job"
              className={`block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Create Job
            </Link>
            <Link
              to="/employer/manage-jobs"
              className={`block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Manage Jobs
            </Link>
            <Link
              to="/employer/profile"
              className={`block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Profile
            </Link>
          </nav>
        </div>
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile/Tablet Header with Hamburger */}
        <div className={`lg:hidden p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md flex items-center justify-between`}>
          <h1 className="text-xl font-bold">Employer Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`p-2 rounded ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-200'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployerLayout;
