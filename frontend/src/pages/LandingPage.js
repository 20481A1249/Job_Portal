import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Analytics from '../components/Analytics';
import Footer from '../components/Footer';

const LandingPage = () => {
  const { darkMode } = useTheme();

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header />
      <Hero />
      <Features />
      <Analytics />
      <Footer />
    </div>
  );
};

export default LandingPage;
