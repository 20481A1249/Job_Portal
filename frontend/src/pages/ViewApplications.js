import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

const ViewApplications = () => {
  const { darkMode } = useTheme();

  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get(`/applications/job/${jobId}`);
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApplications();
  }, [jobId]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/applications/${id}`, { status });
      setApplications(applications.map(app => app._id === id ? { ...app, status } : app));
    } catch (err) {
      console.error(err);
    }
  };



  return (
    <div>
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Applications for Job</h1>
      <div className="space-y-4">
        {applications.map(app => (
          <div key={app._id} className={`p-4 rounded shadow hover:shadow-lg transition-shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
              {app.job.logo && (
                <img
                  src={`https://job-portal-backend-njv6.onrender.com${app.job.logo}`}
                  alt={`${app.job.company} logo`}
                  className="w-10 h-10 md:w-13 md:h-14 rounded-full mr-0 sm:mr-4 mb-2 sm:mb-0 object-cover"
                />
              )}
              <div>
                <h2 className="text-lg md:text-xl font-semibold">{app.applicant.name}</h2>
                <p className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{app.job.title} at {app.job.company}</p>
              </div>
            </div>
            <p className={`mb-2 text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email: {app.applicant.email}</p>
            <p className="mb-2 text-sm md:text-base">Status: <span className={`font-medium ${app.status === 'accepted' ? 'text-green-600' : app.status === 'rejected' ? 'text-red-600' : app.status === 'under review' ? 'text-yellow-600' : app.status === 'shortlisted' ? 'text-blue-600' : app.status === 'interview scheduled' ? 'text-purple-600' : 'text-gray-600'}`}>{app.status}</span></p>
            <a href={`https://job-portal-backend-njv6.onrender.com/api/applications/${app._id}/resume?token=${localStorage.getItem('token')}`} className={`underline text-sm md:text-base ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'}`} target="_blank" rel="noopener noreferrer">View Resume</a>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => handleStatusChange(app._id, 'under review')} className="bg-yellow-500 text-white px-2 py-1 text-xs md:text-sm rounded hover:bg-yellow-600 transition-colors">Under Review</button>
              <button onClick={() => handleStatusChange(app._id, 'shortlisted')} className="bg-blue-500 text-white px-2 py-1 text-xs md:text-sm rounded hover:bg-blue-600 transition-colors">Shortlist</button>
              <button onClick={() => handleStatusChange(app._id, 'interview scheduled')} className="bg-purple-500 text-white px-2 py-1 text-xs md:text-sm rounded hover:bg-purple-600 transition-colors">Interview Scheduled</button>
              <button onClick={() => handleStatusChange(app._id, 'accepted')} className="bg-green-500 text-white px-2 py-1 text-xs md:text-sm rounded hover:bg-green-600 transition-colors">Accept</button>
              <button onClick={() => handleStatusChange(app._id, 'rejected')} className="bg-red-500 text-white px-2 py-1 text-xs md:text-sm rounded hover:bg-red-600 transition-colors">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewApplications;
