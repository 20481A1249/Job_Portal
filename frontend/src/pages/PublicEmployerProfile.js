import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

const PublicEmployerProfile = () => {
  const { darkMode } = useTheme();
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const fetchStartedRef = useRef(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (fetchStartedRef.current) return; // Prevent multiple API calls even in React Strict Mode
      fetchStartedRef.current = true;

      const viewedKey = `viewed_${id}`;
      if (sessionStorage.getItem(viewedKey)) {
        // Profile already viewed in this session, just fetch without counting
        try {
          const res = await api.get(`/users/profile/${id}?no_increment=true`);
          setProfile(res.data);
        } catch (err) {
          console.error(err);
        }
        return;
      }

      try {
        const res = await api.get(`/users/profile/${id}`);
        setProfile(res.data);
        sessionStorage.setItem(viewedKey, 'true'); // Mark as viewed for this session
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [id]);

  if (!profile) return <div className={darkMode ? 'text-white' : 'text-gray-900'}>Loading...</div>;

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`p-6 rounded shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <h1 className="text-3xl font-bold mb-6">Employer Profile</h1>
        <div className="flex items-center mb-6">
          {profile.profile?.logo ? (
            <img src={`https://job-portal-backend-njv6.onrender.com${profile.profile.logo}`} alt="Logo" className="w-20 h-20 rounded-full mr-4 object-cover" />
          ) : (
            <div className="w-20 h-20 bg-gray-300 rounded-full mr-4 flex items-center justify-center text-gray-600">No Logo</div>
          )}
          <div>
            <h2 className="text-2xl font-semibold">{profile.name}</h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{profile.profile?.company}</p>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Bio</h3>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{profile.profile?.bio || 'No bio available'}</p>
        </div>
      </div>
    </div>
  );
};

export default PublicEmployerProfile;
