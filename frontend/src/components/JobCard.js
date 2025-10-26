import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import { timeAgo } from '../utils/dateUtils';

const JobCard = ({ job, appliedJobs, showButtons = true }) => {
  const { darkMode } = useTheme();

  const navigate = useNavigate()
  // const [resume, setResume] = useState(null);
  const hasApplied = appliedJobs.some(app => app.job._id === job._id);

  const handleApply = () => {
    navigate(`/jobseeker/job/${job._id}`);
  };

  return (
    <div className={`p-4 rounded shadow hover:shadow-lg transition-shadow h-full flex flex-col ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center mb-4">
        {job.logo && (
          <img
            src={`https://job-portal-backend-njv6.onrender.com${job.logo}`}
            alt={`${job.company} logo`}
            className="w-13 h-14 rounded-full mr-4 object-cover"
          />
        )}
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{job.title}</h2>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{job.company} - {job.location}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Posted {timeAgo(job.createdAt)}</p>
        </div>
      </div>
      <p className={`mb-2 flex-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.description.substring(0, 100)}...</p>
      <p className="text-green-600 font-medium mb-4">Salary: {job.salary ? `₹${job.salary}` : 'Not specified'}</p>
      <div className={`mt-auto flex gap-2 ${showButtons ? '' : 'hidden'}`}>
        <Link
          to={`/job/${job._id}`}
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-center"
        >
          View Details
        </Link>

        {!hasApplied ? (
          job.status === 'closed' ? (
            <button
              onClick={() => toast.error('This job posting is closed. Applications are no longer being accepted.')}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed"
            >
              Closed
            </button>
          ) : (
            <button
              onClick={handleApply}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Apply
            </button>
          )
        ) : (
          <span className="flex-1 text-green-600 font-medium text-center py-2">Applied</span>
        )}
      </div>
    </div>
  );
};

export default JobCard;
