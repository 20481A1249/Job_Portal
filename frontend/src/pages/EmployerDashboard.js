import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import JobCard from '../components/JobCard';

const EmployerDashboard = () => {
  const { darkMode } = useTheme();

  const [stats, setStats] = useState({ jobs: 0, applications: 0, views: 0 });
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/employer');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs/my-jobs');
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div>
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Employer Dashboard</h1>
      <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className={`p-4 rounded shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <h2 className="text-xl font-semibold">Total Jobs</h2>
          <p className="text-2xl">{stats.jobs}</p>
        </div>
        <div className={`p-4 rounded shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <h2 className="text-xl font-semibold">Applications</h2>
          <p className="text-2xl">{stats.applications}</p>
        </div>
        <div className={`p-4 rounded shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <h2 className="text-xl font-semibold">Profile Views</h2>
          <p className="text-2xl">{stats.views}</p>
        </div>
      </div>

      <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Job Postings</h2>
      <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <JobCard key={job._id} job={job} appliedJobs={[]} showButtons={false} />
        ))}
      </div>

    </div>
  );
};

export default EmployerDashboard;
