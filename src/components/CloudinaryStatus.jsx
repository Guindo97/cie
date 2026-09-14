import React, { useState, useEffect } from 'react';

const CloudinaryStatus = ({ isVisible = false }) => {
  const [cloudinaryConfigured, setCloudinaryConfigured] = useState(false);

  useEffect(() => {
    // Vérifier si Cloudinary est configuré
    const checkCloudinaryConfig = () => {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
      
      console.log('🔍 Vérification Cloudinary:', { cloudName, apiKey });
      
      const isConfigured = cloudName && 
             cloudName !== 'votre-cloud-name' && 
             cloudName !== 'undefined' &&
             apiKey && 
             apiKey !== 'votre-api-key' &&
             apiKey !== 'undefined';
      
      console.log('✅ Cloudinary configuré:', isConfigured);
      return isConfigured;
    };

    setCloudinaryConfigured(checkCloudinaryConfig());
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-start space-x-3">
        <div className={`w-3 h-3 rounded-full mt-1 ${
          cloudinaryConfigured ? 'bg-green-500' : 'bg-orange-500'
        }`}></div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 mb-2">
            {cloudinaryConfigured ? '☁️ Cloudinary Actif' : '📱 Mode Local'}
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            {cloudinaryConfigured 
              ? 'Upload d\'images vers Cloudinary activé'
              : 'Images stockées localement dans le navigateur'
            }
          </p>
          {!cloudinaryConfigured && (
            <div className="text-xs text-gray-500">
              <p className="mb-1">• Images perdues si cache vidé</p>
              <p className="mb-1">• Pas de partage entre utilisateurs</p>
              <p>• Pour activer Cloudinary, configurez le fichier .env</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudinaryStatus;
