import React, { useState } from 'react';

const Evenements = ({ t }) => {
  // ⚙️ Données d'événements (tu peux les modifier librement)
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

  // 🧠 State du formulaire modal
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const INTERAC_NUMBER = "+1 (780) 720-3996"; // ← Ton numéro Interac

  const openForm = (eventTitle) => {
    setSelectedEvent(eventTitle);
    setOpen(true);
  };

  const closeForm = () => {
    setOpen(false);
    setFirstName("");
    setLastName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici tu pourrais envoyer à une API, Google Sheet, EmailJS, etc.
    alert(
      `${t.events.form.success}\n\n` +
      `${t.events.form.summaryName}: ${firstName} ${lastName}\n` +
      `${t.events.form.summaryEvent}: ${selectedEvent}\n` +
      `${t.events.form.summaryPayment}: ${INTERAC_NUMBER}`
    );
    closeForm();
  };

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
                  <button
                    onClick={() => openForm(event.title)}
                    className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
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

      {/* MODAL Formulaire d'inscription */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeForm}
            aria-hidden="true"
          />
          {/* modal */}
          <div className="relative z-10 w-full max-w-xl mx-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-green-500 px-6 py-4 text-white flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {t.events.form.title}
                </h3>
                <button
                  onClick={closeForm}
                  className="text-white/90 hover:text-white"
                  aria-label={t.events.form.close}
                >
                  <i className="fas fa-times text-xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Nom */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {t.events.form.lastName}
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {t.events.form.firstName}
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Événement (pré-rempli) */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {t.events.form.eventName}
                  </label>
                  <input
                    type="text"
                    value={selectedEvent}
                    readOnly
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl"
                  />
                </div>

                {/* Paiement Interac */}
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-1 flex items-center">
                    <i className="fas fa-money-check-alt text-green-500 mr-2" />
                    {t.events.form.paymentTitle}
                  </h4>
                  <p className="text-gray-600">
                    {t.events.form.paymentDesc}{" "}
                    <span className="font-semibold text-gray-800">{INTERAC_NUMBER}</span>.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700"
                  >
                    {t.events.form.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-green-500 text-white font-semibold hover:shadow-lg"
                  >
                    <i className="fas fa-paper-plane mr-2" />
                    {t.events.form.submit}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evenements;
