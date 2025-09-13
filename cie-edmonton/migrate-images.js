// Script de migration des images statiques vers Cloudinary
// Ce script doit être exécuté côté serveur pour des raisons de sécurité

const fs = require('fs');
const path = require('path');

// Configuration Cloudinary
const CLOUDINARY_CONFIG = {
  cloud_name: 'dwe2qubud',
  api_key: '289792115171759',
  api_secret: 'WVu4hFI0VboUZK5KTXotdNljIno'
};

// Images à migrer
const imagesToMigrate = [
  { local: '/img/1.jpg', cloudinary: 'barbecue-accueil', category: 'events' },
  { local: '/img/cuisine.webp', cloudinary: 'atelier-cuisine', category: 'culture' },
  { local: '/img/danse.png', cloudinary: 'soiree-danse', category: 'culture' },
  { local: '/img/happy.jpg', cloudinary: 'independence-2023', category: 'events' },
  { local: '/img/marché.jpg', cloudinary: 'marche-africain', category: 'commerce' },
  { local: '/img/president.jpg', cloudinary: 'president', category: 'community' },
  { local: '/img/vicepresidente.png', cloudinary: 'vice-presidente', category: 'community' },
  { local: '/img/attieke.jpg', cloudinary: 'attieke', category: 'culture' }
];

console.log('🔄 Migration des images vers Cloudinary...');
console.log('📋 Images à migrer:', imagesToMigrate.length);

// Note: Ce script nécessite l'installation de cloudinary
// npm install cloudinary
// Puis exécuter: node migrate-images.js

imagesToMigrate.forEach((img, index) => {
  console.log(`${index + 1}. ${img.local} → ${img.cloudinary} (${img.category})`);
});

console.log('\n✅ URLs Cloudinary générées:');
imagesToMigrate.forEach(img => {
  const url = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/image/upload/q_auto,f_auto,w_auto,h_auto,c_fill/${img.cloudinary}`;
  console.log(`${img.local} → ${url}`);
});
