import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import JobCard from '../components/JobCard';
import FilterContent from '../components/FilterContent';
import api from '../utils/api';

const JobSeekerDashboard = () => {
  const { darkMode } = useTheme();

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filters, setFilters] = useState({ category: '', location: '', type: '' });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        setJobs(res.data);
        setFilteredJobs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchAppliedJobs = async () => {
      try {
        const res = await api.get('/applications/user/me');
        setAppliedJobs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;
    if (filters.category) filtered = filtered.filter(job => job.category.toLowerCase() === filters.category.toLowerCase());
    if (filters.location) filtered = filtered.filter(job => job.location.toLowerCase().includes(filters.location.toLowerCase()));
    if (filters.type) filtered = filtered.filter(job => job.type === filters.type);
    setFilteredJobs(filtered);
  }, [jobs, filters]);



  const handleApply = async (jobId, resume) => {
    if (!resume) {
      toast.error('Please upload a resume');
      return;
    }
    const hasApplied = appliedJobs.some(app => app.job._id === jobId);
    if (hasApplied) {
      toast.warning('You have already applied for this job');
      return;
    }
    const formData = new FormData();
    formData.append('resume', resume);
    try {
      await api.post(`/applications/${jobId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Application submitted');
      // Refresh applied jobs
      const res = await api.get('/applications/user/me');
      setAppliedJobs(res.data);
    } catch (err) {
      toast.error('Failed to submit application');
      console.error(err);
    }
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto">
        <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Job Seeker Dashboard</h1>
        <div className="grid grid-cols-1 tablet:grid-cols-4 lg:grid-cols-4 gap-6">
          <div className="tablet:col-span-1 lg:col-span-1">
            <FilterContent filters={filters} onFilterChange={setFilters} />
          </div>
          <div className="tablet:col-span-3 lg:col-span-3">
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
              {filteredJobs.map(job => (
                <JobCard key={job._id} job={job} onApply={handleApply} appliedJobs={appliedJobs} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
