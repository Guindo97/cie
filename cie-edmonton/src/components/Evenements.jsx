import React from 'react';

const Evenements = ({ t }) => {
  const upcomingEvents = [
    {
      title: "Fête de l'Indépendance 2024",
      date: "7 août 2024",
      time: "18h00 - 23h00",
      location: "Centre communautaire d'Edmonton",
      description: "Célébration de l'indépendance de la Côte d'Ivoire avec spectacles, cuisine traditionnelle et danses.",
      image: "🎉",
      price: "Gratuit"
    },
    {
      title: "Soirée Culturelle Automne",
      date: "15 septembre 2024",
      time: "19h00 - 22h00",
      location: "Salle des fêtes Alberta",
      description: "Soirée dédiée à la culture ivoirienne avec contes, musique et dégustation.",
      image: "🎭",
      price: "15$ CAD"
    },
    {
      title: "Atelier Cuisine Ivoirienne",
      date: "22 octobre 2024",
      time: "14h00 - 17h00",
      location: "École culinaire d'Edmonton",
      description: "Apprenez à préparer les plats traditionnels ivoiriens avec nos chefs.",
      image: "👩‍🍳",
      price: "25$ CAD"
    }
  ];

  const pastEvents = [
    {
      title: "Journée Portes Ouvertes",
      date: "12 mai 2024",
      participants: "85 personnes",
      image: "🏠"
    },
    {
      title: "Festival de Pâques",
      date: "31 mars 2024",
      participants: "120 personnes",
      image: "🐰"
    },
    {
      title: "Gala de Fin d'Année",
      date: "16 décembre 2023",
      participants: "200 personnes",
      image: "✨"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold gradient-text mb-6">
            {t.events.title}
          </h1>
          <p className="text-2xl text-gray-600">
            {t.events.subtitle}
          </p>
        </div>

        {/* Upcoming Events */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <i className="fas fa-calendar-plus text-orange-500 mr-4"></i>
            {t.events.upcoming}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="card-hover bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-green-500 p-6 text-center">
                  <div className="text-6xl mb-4">{event.image}</div>
                  <div className="text-white font-bold text-lg">{event.price}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-calendar text-orange-500 w-5"></i>
                      <span className="ml-2">{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-clock text-green-500 w-5"></i>
                      <span className="ml-2">{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-map-marker-alt text-blue-500 w-5"></i>
                      <span className="ml-2">{event.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>
                  <button className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                    <i className="fas fa-ticket-alt mr-2"></i>
                    {t.events.register}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Events */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <i className="fas fa-history text-green-500 mr-4"></i>
            {t.events.past}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <div key={index} className="card-hover bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="text-4xl mb-4">{event.image}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-2">{event.date}</p>
                <p className="text-orange-600 font-semibold">{event.participants}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evenements;
