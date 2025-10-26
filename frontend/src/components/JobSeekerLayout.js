import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const JobSeekerLayout = () => {
  const { logout, user, setUser } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const res = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(res.data.user);
      toast.success('Profile picture updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile picture.');
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Mobile/Tablet Sidebar Overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
        <div className={`absolute top-0 left-0 w-64 h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg flex flex-col`}>
          <div className="p-6 flex-1">
            <div className="mb-6 flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
                id="profilePictureInput"
              />
              <label htmlFor="profilePictureInput" className="cursor-pointer">
                {user?.profile?.profilePicture ? (
                  <img src={`https://job-portal-backend-njv6.onrender.com${user.profile.profilePicture}`} alt="Profile" className="w-12 h-12 rounded-full mr-4 object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full mr-4 bg-gray-300 flex items-center justify-center text-gray-600">pic</div>
                )}
              </label>
              <div>
                <h3 className="text-lg font-semibold">Hello, {user?.name || 'Job Seeker'}!</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Welcome back</p>
              </div>
            </div>
            <nav className="space-y-4">
              <Link
                to="/jobseeker/dashboard"
                className={`block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                onClick={() => setSidebarOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/jobseeker/saved-jobs"
                className={`block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                onClick={() => setSidebarOpen(false)}
              >
                Saved Jobs
              </Link>
              <Link
                to="/jobseeker/profile"
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
      <div className={`hidden lg:flex w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg flex flex-col`}>
        <div className="p-6 flex-1">
          <div className="mb-6 flex items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
              id="profilePictureInput"
            />
            <label htmlFor="profilePictureInput" className="cursor-pointer">
              {user?.profile?.profilePicture ? (
                <img src={`https://job-portal-backend-njv6.onrender.com${user.profile.profilePicture}`} alt="Profile" className="w-12 h-12 rounded-full mr-4 object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full mr-4 bg-gray-300 flex items-center justify-center text-gray-600">pic</div>
              )}
            </label>
            <div>
              <h3 className="text-lg font-semibold">Hello, {user?.name || 'Job Seeker'}!</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Welcome back</p>
            </div>
          </div>
          <nav className="space-y-4">
            <Link
              to="/jobseeker/dashboard"
              className={`block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Dashboard
            </Link>
            <Link
              to="/jobseeker/saved-jobs"
              className={`block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Saved Jobs
            </Link>
            <Link
              to="/jobseeker/profile"
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
          <h1 className="text-xl font-bold">Job Seeker Dashboard</h1>
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

export default JobSeekerLayout;
