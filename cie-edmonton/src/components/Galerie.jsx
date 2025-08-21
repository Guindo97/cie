import React, { useState } from 'react';

const Galerie = ({ t }) => {
  // On lit toutes les chaînes depuis t.gallery
  const g = t.gallery;

  // Clés stables des catégories (doivent exister dans translations.js)
  const categoryKeys = [
    "all",
    "events",
    "culture",
    "community",
    "family",
    "celebrations",
    "sport",
    "commerce",
  ];

  // Items (clé = correspondance dans g.items)
  const galleryItems = [
    { key: "independence2023", category: "events", emoji: "🎉" },
    { key: "cookingWorkshop", category: "culture", emoji: "🍲" },
    { key: "danceNight", category: "culture", emoji: "💃" },
    { key: "generalAssembly", category: "community", emoji: "🤝" },
    { key: "kidsFestival", category: "family", emoji: "👶" },
    { key: "weddingCeremony", category: "celebrations", emoji: "💒" },
    { key: "footballMatch", category: "sport", emoji: "⚽" },
    { key: "musicConcert", category: "culture", emoji: "🎵" },
    { key: "africanMarket", category: "commerce", emoji: "🛒" },
  ];

  const [selectedCategoryKey, setSelectedCategoryKey] = useState("all");

  const itemsFiltered =
    selectedCategoryKey === "all"
      ? galleryItems
      : galleryItems.filter((i) => i.category === selectedCategoryKey);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold gradient-text mb-6">
            {g.title}
          </h1>
          <p className="text-2xl text-gray-600">{g.subtitle}</p>
        </div>

        {/* Filtres catégories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categoryKeys.map((ck) => (
            <button
              key={ck}
              onClick={() => setSelectedCategoryKey(ck)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                selectedCategoryKey === ck
                  ? 'bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              {g.categories[ck]}
            </button>
          ))}
        </div>

        {/* Grille */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {itemsFiltered.map((item) => (
            <div
              key={item.key}
              className="card-hover bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="h-64 bg-gradient-to-br from-orange-200 via-white to-green-200 flex items-center justify-center relative">
                <span className="text-8xl">{item.emoji}</span>
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                  {g.categories[item.category]}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {g.items[item.key].title}
                </h3>
                <p className="text-gray-600">{g.cardDesc}</p>
                <button className="mt-4 text-orange-500 hover:text-orange-600 font-medium flex items-center">
                  <span>{g.more}</span>
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
