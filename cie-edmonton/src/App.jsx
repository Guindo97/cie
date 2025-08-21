import React, { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Accueil from './components/Accueil';
import APropos from './components/APropos';
import Evenements from './components/Evenements';
import Services from './components/Services';
import Galerie from './components/Galerie';
import Contact from './components/Contact';
import { translations } from './utils/translations.js';
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
      case 'home': return <Accueil t={t} setCurrentPage={setCurrentPage} />;
      case 'about': return <APropos t={t} />;
      case 'events': return <Evenements t={t} language={language} />;
      case 'services': return <Services t={t} language={language} />;
      case 'gallery': return <Galerie t={t} />;
      case 'contact': return <Contact t={t} />;
      default: return <Accueil t={t} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        language={language}
        setLanguage={setLanguage}
        t={t}
      />
      {renderPage()}
    </div>
  );
};

export default App;
