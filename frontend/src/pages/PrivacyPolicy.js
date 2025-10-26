import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
        <p className="text-lg text-center max-w-2xl mx-auto">
          Your privacy is important to us. This policy outlines how we collect, use, and protect
          your personal information when using our job portal services.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
