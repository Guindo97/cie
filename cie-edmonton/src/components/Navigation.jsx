// src/components/Navigation.jsx
import React, { useEffect, useState } from 'react';

const Navigation = ({ currentPage, setCurrentPage, language, setLanguage, t }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { key: 'home', label: t.nav.home, icon: 'fas fa-home' },
    { key: 'about', label: t.nav.about, icon: 'fas fa-users' },
    { key: 'events', label: t.nav.events, icon: 'fas fa-calendar' },
    { key: 'services', label: t.nav.services, icon: 'fas fa-hands-helping' },
    { key: 'gallery', label: t.nav.gallery, icon: 'fas fa-images' },
    { key: 'contact', label: t.nav.contact, icon: 'fas fa-envelope' }
  ];

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-xl sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* === BRAND (Desktop) === */}
            <button 
              onClick={() => setCurrentPage('home')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300 cursor-pointer"
              aria-label="Retour à l'accueil"
            >
              {/* Drapeau rond */}
              <div className="w-12 h-12 flag-gradient rounded-full animate-pulse-slow shadow-lg" />

              {/* Logo CICE en rond */}
              <img
                src="/img/logocice.png"
                alt="Logo CICE"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-lg"
              />

              <div className="ml-1">
                <span className="text-2xl font-bold gradient-text">CICE</span>
                <p className="text-xs text-gray-600">Edmonton</p>
              </div>
            </button>

            {/* === NAV ITEMS (Desktop) === */}
            <div className="hidden lg:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setCurrentPage(item.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                    currentPage === item.key
                      ? 'bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'
                  }`}
                  aria-current={currentPage === item.key ? 'page' : undefined}
                >
                  <i className={item.icon} aria-hidden="true"></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* === LANG + MENU === */}
            <div className="flex items-center space-x-4">
              {/* Test Cloudinary (temporaire) */}
              <button
                onClick={() => setCurrentPage('test-cloudinary')}
                className="text-blue-400 hover:text-blue-500 p-2 transition-colors"
                aria-label="Test Cloudinary"
                title="Test Cloudinary"
              >
                <i className="fas fa-cloud text-sm" aria-hidden="true"></i>
              </button>

              {/* Admin link (discret) */}
              <button
                onClick={() => setCurrentPage('admin')}
                className="text-gray-400 hover:text-orange-500 p-2 transition-colors"
                aria-label="Administration"
                title="Administration"
              >
                <i className="fas fa-cog text-sm" aria-hidden="true"></i>
              </button>

              {/* Switch langue */}
              <button
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                aria-label="Changer de langue"
              >
                <i className="fas fa-globe mr-2" aria-hidden="true"></i>
                {language === 'fr' ? 'EN' : 'FR'}
              </button>

              {/* Burger menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-700 hover:text-orange-500 p-2"
                aria-label="Ouvrir le menu"
              >
                <i
                  className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}
                  aria-hidden="true"
                ></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* === MOBILE MENU === */}
      <div className={`lg:hidden fixed inset-0 z-40 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Fermer le menu"
        ></div>
        <div
          className={`mobile-menu ${mobileMenuOpen ? 'open' : ''} fixed left-0 top-0 h-full w-80 bg-white shadow-2xl`}
        >
          <div className="p-6">
            {/* BRAND (Mobile) */}
            <button 
              onClick={() => {
                setCurrentPage('home');
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-3 mb-8 hover:opacity-80 transition-opacity duration-300 cursor-pointer"
              aria-label="Retour à l'accueil"
            >
              <div className="w-12 h-12 flag-gradient rounded-full" />
              <img
                src="/img/logocice.png"
                alt="Logo CICE"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow"
              />
              <div className="ml-1">
                <span className="text-2xl font-bold gradient-text">CICE</span>
                <p className="text-xs text-gray-600">Edmonton</p>
              </div>
            </button>

            {/* NAV ITEMS Mobile */}
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setCurrentPage(item.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-all duration-300 flex items-center space-x-3 ${
                    currentPage === item.key
                      ? 'bg-gradient-to-r from-orange-500 to-green-500 text-white'
                      : 'text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  <i className={item.icon} aria-hidden="true"></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
