import React from 'react';
import { useTheme } from '../context/ThemeContext';

const FilterContent = ({ filters, onFilterChange }) => {
  const { darkMode } = useTheme();

  const handleChange = (e) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className={`p-4 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Filters</h3>
      <div className="space-y-2">
        <select name="category" onChange={handleChange} className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}>
          <option value="">All Categories</option>
          <option value="tech">Tech</option>
          <option value="it support">IT Support</option>
          <option value="software development">Software Development</option>
          <option value="marketing">Marketing</option>
          <option value="sales">Sales</option>
          <option value="finance">Finance</option>
          <option value="hr">HR</option>
          <option value="operations">Operations</option>
          <option value="design">Design</option>
          <option value="engineering">Engineering</option>
          <option value="data science">Data Science</option>
          <option value="product management">Product Management</option>
          <option value="consulting">Consulting</option>
          <option value="education">Education</option>
          <option value="healthcare">Healthcare</option>
        </select>
        <select name="location" onChange={handleChange} className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}>
          <option value="">All Locations</option>
          <option value="remote">Remote</option>
          <option value="bengaluru">Bengaluru</option>
          <option value="hyderabad">Hyderabad</option>
          <option value="pune">Pune</option>
          <option value="chennai">Chennai</option>
          <option value="mumbai">Mumbai</option>
          <option value="delhi">Delhi</option>
          <option value="gurugram">Gurugram</option>
          <option value="noida">Noida</option>

        </select>
        <select name="type" onChange={handleChange} className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}>
          <option value="">All Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
        </select>
      </div>
    </div>
  );
};

export default FilterContent;
