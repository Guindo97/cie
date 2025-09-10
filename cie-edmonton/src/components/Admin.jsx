import React, { useState, useEffect } from 'react';
import EventManager from './EventManager';
import GalleryManager from './GalleryManager';

const Admin = ({ t, language, setCurrentPage }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Mot de passe simple pour l'admin (en production, utiliser une authentification plus sécurisée)
  const ADMIN_PASSWORD = 'cice2025';

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
      // Sauvegarder l'état de connexion
      localStorage.setItem('adminLoggedIn', 'true');
    } else {
      setLoginError('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    localStorage.removeItem('adminLoggedIn');
  };

  // Vérifier si l'admin est déjà connecté
  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center py-20">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-white text-2xl"></i>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Administration</h1>
              <p className="text-gray-600">Accès réservé à l'équipe du bureau</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Entrez le mot de passe"
                  required
                />
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                Se connecter
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête Admin */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">Administration</h1>
              <p className="text-gray-600 text-sm sm:text-base">Gestion du contenu du site</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-500">
                <i className="fas fa-user-shield mr-2"></i>
                Connecté en tant qu'administrateur
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Navigation des onglets */}
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'events'
                  ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <i className="fas fa-calendar-alt mr-2"></i>
              Gestion des Événements
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'gallery'
                  ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <i className="fas fa-images mr-2"></i>
              Gestion de la Galerie
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <EventManager />
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <GalleryManager />
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
