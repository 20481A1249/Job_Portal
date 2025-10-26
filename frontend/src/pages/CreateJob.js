import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

const CreateJob = () => {
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    category: '',
    salary: '',
    type: 'full-time',
    requirements: '',
  });
  const [logo, setLogo] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobData = { ...formData, requirements: formData.requirements.split(',') };
      if (logo) {
        const formDataWithLogo = new FormData();
        Object.keys(jobData).forEach(key => {
          formDataWithLogo.append(key, jobData[key]);
        });
        formDataWithLogo.append('logo', logo);
        await api.post('/jobs', formDataWithLogo, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/jobs', jobData);
      }
      navigate('/employer/manage-jobs');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create Job Posting</h1>
      <form onSubmit={handleSubmit} className={`p-6 rounded shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" placeholder="Job Title" onChange={handleChange} className={`border p-2 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} required />
          <input name="company" placeholder="Company" onChange={handleChange} className={`border p-2 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} required />
          <input name="location" placeholder="Location" onChange={handleChange} className={`border p-2 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} required />
          <input name="category" placeholder="Category" onChange={handleChange} className={`border p-2 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} required />
          <input name="salary" placeholder="Salary" type="number" onChange={handleChange} className={`border p-2 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} />
          <select name="type" onChange={handleChange} className={`border p-2 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
        </div>
        <textarea name="description" placeholder="Description" onChange={handleChange} className={`border p-2 rounded w-full mt-4 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} required />
        <textarea name="requirements" placeholder="Requirements (comma-separated)" onChange={handleChange} className={`border p-2 rounded w-full mt-4 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} />
        <div className="mt-4">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Company Logo (optional)</label>
          <input type="file" onChange={(e) => setLogo(e.target.files[0])} className={`border p-2 rounded w-full ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} accept="image/*" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition-colors">Create Job</button>
      </form>
    </div>
  );
};

export default CreateJob;
