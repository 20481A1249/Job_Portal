import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

const AppliedJobs = () => {
  const { darkMode } = useTheme();

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/user/me');
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Saved Jobs</h1>
      <div className="space-y-4">
        {applications.map(app => (
          <div key={app._id} className={`p-4 rounded shadow hover:shadow-lg transition-shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex items-center mb-4">
              {app.job.logo && (
                <img
                  src={`http://localhost:5000${app.job.logo}`}
                  alt={`${app.job.company} logo`}
                  className="w-13 h-14 rounded-full mr-4 object-cover"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">{app.job.title}</h2>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{app.job.company} - {app.job.location}</p>
              </div>
            </div>
            <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{app.job.description.substring(0, 100)}...</p>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Application Status: <span className={`font-semibold ${app.status === 'accepted' ? 'text-green-600' : app.status === 'rejected' ? 'text-red-600' : app.status === 'reviewed' ? 'text-blue-600' : 'text-yellow-600'}`}>{app.status}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppliedJobs;
