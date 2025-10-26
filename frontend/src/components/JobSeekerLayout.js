import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const JobSeekerLayout = () => {
  const { logout, user, setUser } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

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
      {/* Sidebar */}
      <div className={`w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg flex flex-col`}>
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
                <img src={`http://localhost:5000${user.profile.profilePicture}`} alt="Profile" className="w-12 h-12 rounded-full mr-4 object-cover" />
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
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default JobSeekerLayout;
