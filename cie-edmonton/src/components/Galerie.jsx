import React, { useState } from 'react';

const Galerie = () => {
  const galleryItems = [
    { title: "Fête de l'Indépendance 2023", category: "Événements", emoji: "🎉" },
    { title: "Atelier Cuisine Traditionnelle", category: "Culture", emoji: "🍲" },
    { title: "Soirée Danse Ivoirienne", category: "Culture", emoji: "💃" },
    { title: "Assemblée Générale", category: "Communauté", emoji: "🤝" },
    { title: "Festival des Enfants", category: "Famille", emoji: "👶" },
    { title: "Cérémonie de Mariage", category: "Célébrations", emoji: "💒" },
    { title: "Match de Football", category: "Sport", emoji: "⚽" },
    { title: "Concert de Musique", category: "Culture", emoji: "🎵" },
    { title: "Marché Africain", category: "Commerce", emoji: "🛒" }
  ];

  const categories = ["Tous", "Événements", "Culture", "Communauté", "Famille", "Célébrations", "Sport", "Commerce"];
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filteredItems = selectedCategory === "Tous"
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold gradient-text mb-6">
            Galerie / Gallery
          </h1>
          <p className="text-2xl text-gray-600">
            Nos plus beaux moments en images
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <div key={index} className="card-hover bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-orange-200 via-white to-green-200 flex items-center justify-center relative">
                <span className="text-8xl">{item.emoji}</span>
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                  {item.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">Une belle célébration de notre communauté</p>
                <button className="mt-4 text-orange-500 hover:text-orange-600 font-medium flex items-center">
                  <span>Voir plus</span>
                  <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Galerie;
