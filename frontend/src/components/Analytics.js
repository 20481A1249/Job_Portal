import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

const Analytics = () => {
  const { darkMode } = useTheme();

  const [stats, setStats] = useState([
    { number: '0', label: 'Jobs Posted' },
    { number: '0', label: 'Active Users' },
    { number: '0', label: 'Companies' },
    { number: '0%', label: 'Success Rate' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/public');
        const data = res.data;
        setStats([
          { number: data.jobsPosted.toString(), label: 'Jobs Posted' },
          { number: data.activeUsers.toString(), label: 'Active Users' },
          { number: data.companies.toString(), label: 'Companies' },
          { number: data.successRate, label: 'Success Rate' },
        ]);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        // Fallback to static data if API fails
        setStats([
          { number: '10,000+', label: 'Jobs Posted' },
          { number: '5,000+', label: 'Active Users' },
          { number: '500+', label: 'Companies' },
          { number: '95%', label: 'Success Rate' },
        ]);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className={`py-16 ${darkMode ? 'bg-gray-800 text-white' : 'bg-blue-600 text-white'}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-xl">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Analytics;
