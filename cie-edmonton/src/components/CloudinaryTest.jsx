import React, { useState } from 'react';
import CloudinaryService from '../utils/cloudinaryService';

const CloudinaryTest = () => {
  const [testResult, setTestResult] = useState('');
  const [uploading, setUploading] = useState(false);

  const testCloudinaryConnection = async () => {
    setTestResult('Test de connexion Cloudinary...');
    
    try {
      // Test simple avec une image de test
      const testImageUrl = 'https://res.cloudinary.com/dwe2qubud/image/upload/q_auto,f_auto,w_200,h_200,c_fill/sample.jpg';
      
      const response = await fetch(testImageUrl);
      if (response.ok) {
        setTestResult('✅ Connexion Cloudinary OK - L\'image de test se charge correctement');
      } else {
        setTestResult('❌ Erreur de connexion Cloudinary - Code: ' + response.status);
      }
    } catch (error) {
      setTestResult('❌ Erreur de connexion Cloudinary: ' + error.message);
    }
  };

  const testUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setTestResult('Upload en cours...');

    try {
      const result = await CloudinaryService.uploadImage(file, {
        folder: 'cice-edmonton/test',
        public_id: `test_${Date.now()}`
      });

      if (result.success) {
        setTestResult(`✅ Upload réussi ! URL: ${result.data.secure_url}`);
      } else {
        setTestResult(`❌ Erreur upload: ${result.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Erreur upload: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">Test Cloudinary</h3>
      
      <div className="space-y-4">
        <button
          onClick={testCloudinaryConnection}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Tester la connexion
        </button>

        <div>
          <label className="block text-sm font-medium mb-2">
            Tester l'upload d'une image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={testUpload}
            disabled={uploading}
            className="w-full"
          />
        </div>

        {testResult && (
          <div className={`p-3 rounded ${
            testResult.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {testResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudinaryTest;
