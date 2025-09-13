// src/App.jsx
import React, { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Accueil from './components/Accueil'; // ← garde bien "Accueil" (avec 2 c)
import APropos from './components/APropos';
import Evenements from './components/Evenements';
import Services from './components/Services';
import Galerie from './components/Galerie';
import Contact from './components/Contact';
import Admin from './components/Admin';
import Footer from './components/Footer';
import CloudinaryTest from './components/CloudinaryTest';
import { translations } from './utils/translations';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [language, setLanguage] = useState('fr');

  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved) setLanguage(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const t = translations[language];

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Accueil t={t} language={language} setCurrentPage={setCurrentPage} />;
      case 'about': return <APropos t={t} language={language} />;
      case 'events': return <Evenements t={t} language={language} />;
      case 'services': return <Services t={t} language={language} />;
      case 'gallery': return <Galerie t={t} />;
      case 'contact': return <Contact t={t} />;
      case 'admin': return <Admin t={t} language={language} setCurrentPage={setCurrentPage} />;
      default: return <Accueil t={t} language={language} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        language={language}
        setLanguage={setLanguage}
        t={t}
      />
      <div className="flex-1">
        {currentPage === 'test-cloudinary' ? (
          <div className="min-h-screen bg-gray-100 py-20">
            <div className="max-w-4xl mx-auto px-4">
              <CloudinaryTest />
            </div>
          </div>
        ) : (
          renderPage()
        )}
      </div>
      <Footer 
        t={t} 
        language={language} 
        setCurrentPage={setCurrentPage} 
      />
    </div>
  );
};

export default App;
