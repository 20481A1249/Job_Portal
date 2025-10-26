import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
        <p className="text-lg text-center max-w-2xl mx-auto">
          JobPortal is dedicated to connecting talented individuals with exciting career opportunities.
          Our platform provides a seamless experience for job seekers and employers alike, fostering
          growth and success in the professional world.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default About;
