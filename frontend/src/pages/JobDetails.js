import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { timeAgo } from '../utils/dateUtils';

const JobDetails = () => {
  const { darkMode } = useTheme();

  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const checkApplication = async () => {
      try {
        const res = await api.get('/applications/user/me');
        const applied = res.data.some(app => app.job._id === id);
        setHasApplied(applied);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJob();
    checkApplication();
  }, [id]);

  const handleApply = async () => {
    if (!resume) {
      toast.error('Please upload a resume');
      return;
    }
    if (hasApplied) {
      toast.warning('You have already applied for this job');
      return;
    }
    if (job.status === 'closed') {
      toast.error('This job posting is closed. Applications are no longer being accepted.');
      return;
    }
    const formData = new FormData();
    formData.append('resume', resume);
    try {
      await api.post(`/applications/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Application submitted');
      setHasApplied(true);
    } catch (err) {
      toast.error('Failed to submit application');
      console.error(err);
    }
  };

  if (!job) return <div className={darkMode ? 'text-white' : 'text-gray-900'}>Loading...</div>;

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`p-6 rounded shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex items-center mb-6">
          {job.logo && (
            <img
              src={`http://localhost:5000${job.logo}`}
              alt={`${job.company} logo`}
              className="w-16 h-16 rounded-full mr-4 object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{job.company} - {job.location}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <p><strong>Salary:</strong> <span className="text-green-600 font-medium">{job.salary ? `₹${job.salary}` : 'Not specified'}</span></p>
          <p><strong>Type:</strong> {job.type}</p>
          <p><strong>Posted:</strong> {timeAgo(job.createdAt)}</p>
          <p><strong>Employer:</strong> <Link to={`/employer-profile/${job.employer._id}`} className="text-blue-500 hover:underline">{job.employer.name}</Link></p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{job.description}</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Requirements</h2>
          <ul className={`list-disc list-inside ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <input type="file" onChange={(e) => setResume(e.target.files[0])} disabled={job.status === 'closed'} className={`mb-4 border p-2 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${job.status === 'closed' ? 'cursor-not-allowed' : ''}`} />
          <button onClick={handleApply} disabled={job.status === 'closed'} className={`px-4 py-2 rounded transition-colors text-white ${job.status === 'closed' ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}>Apply</button>
          {job.status === 'closed' && <p className="text-red-500 mt-2">This job posting is closed. Applications are no longer being accepted.</p>}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
