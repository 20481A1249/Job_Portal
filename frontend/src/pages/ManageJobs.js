import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { timeAgo } from '../utils/dateUtils';

const ManageJobs = () => {
  const { darkMode } = useTheme();

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs/my-jobs');
        setJobs(res.data);
        setFilteredJobs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, statusFilter]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter(job => job._id !== id));
      toast.success('Job deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete job');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/jobs/${id}/status`, { status: newStatus });
      setJobs(jobs.map(job => job._id === id ? { ...job, status: newStatus } : job));
      toast.success('Job status updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update job status');
    }
  };

  return (
    <div>
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Manage Jobs</h1>

      {/* Filters */}
      <div className={`mb-6 p-4 rounded shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 p-2 border rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`p-2 border rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredJobs.map(job => (
          <div key={job._id} className={`p-4 rounded shadow hover:shadow-lg transition-shadow flex justify-between items-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex items-center">
              {job.logo && (
                <img
                  src={`http://localhost:5000${job.logo}`}
                  alt={`${job.company} logo`}
                  className="w-12 h-13 rounded-full mr-4 object-cover"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{job.company} - {job.location}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status: <span className={`font-medium ${job.status === 'active' ? 'text-green-600' : job.status === 'draft' ? 'text-yellow-600' : 'text-red-600'}`}>{job.status}</span></p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Applicants: {job.applicationCount || 0}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Posted {timeAgo(job.createdAt)}</p>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <Link to={`/employer/view-applications/${job._id}`} className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 transition-colors">View Applications</Link>
                <Link to={`/employer/edit-job/${job._id}`} className="bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600 transition-colors">Edit</Link>
                <button onClick={() => handleDelete(job._id)} className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 transition-colors">Delete</button>
              </div>
              <select
                value={job.status}
                onChange={(e) => handleStatusChange(job._id, e.target.value)}
                className={`p-1 text-sm border rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageJobs;
