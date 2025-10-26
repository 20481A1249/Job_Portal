import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Features = () => {
  const { darkMode } = useTheme();

  const features = [
    { title: 'Job Search', description: 'Browse thousands of job listings with advanced filters' },
    { title: 'Resume Upload', description: 'Upload and manage your resume for easy application' },
    { title: 'Company Profiles', description: 'View detailed company information and reviews' },
    { title: 'Application Tracking', description: 'Track your job applications and their status' },
  ];

  return (
    <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Why Choose JobPortal?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`p-6 rounded-lg shadow-md text-center ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
