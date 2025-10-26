import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

const EmployerProfile = () => {
  const { darkMode } = useTheme();

  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div>
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Employer Profile</h1>
      <div className={`p-6 rounded shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <h2 className="text-2xl font-semibold">{profile.name}</h2>
        <p>Email: {profile.email}</p>
        <p>Company: {profile.profile?.company}</p>
        <p>Bio: {profile.profile?.bio}</p>
        {profile.profile?.logo ? (
          <img src={`https://job-portal-backend-njv6.onrender.com${profile.profile.logo}`} alt="Logo" className="w-20 h-20 mt-4" />
        ) : (
          <div className="w-20 h-20 bg-gray-300 rounded-full mt-4 flex items-center justify-center text-gray-600">No Logo</div>
        )}
        <Link to="/employer/edit-profile" className="bg-blue-500 text-white px-4 py-2 rounded mt-4 inline-block">Edit Profile</Link>
      </div>
    </div>
  );
};

export default EmployerProfile;
