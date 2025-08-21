import React from 'react';

const Evenements = ({ t, language = 'fr' }) => {
  const L = language === 'en' ? 'en' : 'fr';

  const upcomingEvents = [
    {
      title: { fr: "Fête de l'Indépendance 2024", en: "Independence Day Celebration 2024" },
      date:  { fr: "7 août 2024",                 en: "August 7, 2024" },
      time:  { fr: "18h00 - 23h00",               en: "6:00 PM – 11:00 PM" },
      location: {
        fr: "Centre communautaire d'Edmonton",
        en: "Edmonton Community Centre"
      },
      description: {
        fr: "Célébration de l'indépendance de la Côte d'Ivoire avec spectacles, cuisine traditionnelle et danses.",
        en: "Celebration of Côte d'Ivoire's independence with shows, traditional food and dances."
      },
      image: "🎉",
      price: { fr: "Gratuit", en: "Free" }
    },
    {
      title: { fr: "Soirée Culturelle Automne", en: "Autumn Cultural Night" },
      date:  { fr: "15 septembre 2024",        en: "September 15, 2024" },
      time:  { fr: "19h00 - 22h00",            en: "7:00 PM – 10:00 PM" },
      location: { fr: "Salle des fêtes Alberta", en: "Alberta Hall" },
      description: {
        fr: "Soirée dédiée à la culture ivoirienne avec contes, musique et dégustation.",
        en: "An evening dedicated to Ivorian culture with storytelling, music, and tasting."
      },
      image: "🎭",
      price: { fr: "15$ CAD", en: "CAD $15" }
    },
    {
      title: { fr: "Atelier Cuisine Ivoirienne", en: "Ivorian Cooking Workshop" },
      date:  { fr: "22 octobre 2024",            en: "October 22, 2024" },
      time:  { fr: "14h00 - 17h00",              en: "2:00 PM – 5:00 PM" },
      location: { fr: "École culinaire d'Edmonton", en: "Edmonton Culinary School" },
      description: {
        fr: "Apprenez à préparer les plats traditionnels ivoiriens avec nos chefs.",
        en: "Learn to prepare traditional Ivorian dishes with our chefs."
      },
      image: "👩‍🍳",
      price: { fr: "25$ CAD", en: "CAD $25" }
    }
  ];

  const pastEvents = [
    {
      title: { fr: "Journée Portes Ouvertes", en: "Open House Day" },
      date:  { fr: "12 mai 2024",            en: "May 12, 2024" },
      participants: { fr: "85 personnes",    en: "85 attendees" },
      image: "🏠"
    },
    {
      title: { fr: "Festival de Pâques",     en: "Easter Festival" },
      date:  { fr: "31 mars 2024",           en: "March 31, 2024" },
      participants: { fr: "120 personnes",   en: "120 attendees" },
      image: "🐰"
    },
    {
      title: { fr: "Gala de Fin d'Année",    en: "Year-End Gala" },
      date:  { fr: "16 décembre 2023",       en: "December 16, 2023" },
      participants: { fr: "200 personnes",   en: "200 attendees" },
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
                  <div className="text-white font-bold text-lg">{event.price[L]}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title[L]}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-calendar text-orange-500 w-5"></i>
                      <span className="ml-2">{event.date[L]}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-clock text-green-500 w-5"></i>
                      <span className="ml-2">{event.time[L]}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-map-marker-alt text-blue-500 w-5"></i>
                      <span className="ml-2">{event.location[L]}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">{event.description[L]}</p>
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
                <h3 className="text-lg font-bold text-gray-800 mb-2">{event.title[L]}</h3>
                <p className="text-gray-600 mb-2">{event.date[L]}</p>
                <p className="text-orange-600 font-semibold">{event.participants[L]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evenements;
