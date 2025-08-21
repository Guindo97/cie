import React, { useState, useEffect } from 'react';

const Evenements = ({ t }) => {
  // On lit désormais toutes les cartes depuis translations.js
  const upcomingEvents = t.events.items?.upcoming ?? [];
  const pastEvents = t.events.items?.past ?? [];

  // --- État du formulaire d'inscription ---
  const [isOpen, setIsOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    eventName: "",
  });

  // Empêche le scroll derrière le modal (mobile/desktop)
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const openForm = (eventTitle) => {
    setFormSent(false);
    setFormData((prev) => ({ ...prev, eventName: eventTitle }));
    setIsOpen(true);
  };

  const closeForm = () => {
    setIsOpen(false);
    setFormSent(false);
    setFormData({ firstName: "", lastName: "", eventName: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici tu peux envoyer les données (EmailJS / API backend) si tu veux.
    setFormSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold gradient-text mb-6">
            {t.events.title}
          </h1>
          <p className="text-2xl text-gray-600">
            {t.events.subtitle}
          </p>
        </div>

        {/* À venir / Upcoming */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <i className="fas fa-calendar-plus text-orange-500 mr-4"></i>
            {t.events.upcoming}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.key} className="card-hover bg-white rounded-2xl shadow-xl overflow-hidden">
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

        {/* Passés / Past */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <i className="fas fa-history text-green-500 mr-4"></i>
            {t.events.past}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <div key={event.key} className="card-hover bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="text-4xl mb-4">{event.image}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-2">{event.date}</p>
                {event.participants && (
                  <p className="text-orange-600 font-semibold">{event.participants}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Modal d'inscription --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          {/* Fond */}
          <button className="absolute inset-0 bg-black/50" onClick={closeForm} aria-label={t.events.form.close} />

          {/* Boîte */}
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-orange-500 to-green-500 p-6 text-white">
              <h3 className="text-2xl font-bold">{t.events.form.title}</h3>
              {formData.eventName && (
                <p className="mt-1 opacity-90">
                  {t.events.form.eventName}: <span className="font-semibold">{formData.eventName}</span>
                </p>
              )}
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-6">
              {formSent ? (
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl">
                  <i className="fas fa-check-circle mr-2"></i>
                  {t.events.form.success}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">{t.events.form.firstName}</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                        required
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">{t.events.form.lastName}</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                        required
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">{t.events.form.eventName}</label>
                    <input
                      type="text"
                      value={formData.eventName}
                      onChange={(e) => setFormData((p) => ({ ...p, eventName: e.target.value }))}
                      required
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="font-semibold mb-1">
                      <i className="fas fa-wallet mr-2 text-orange-600"></i>
                      {t.events.form.paymentTitle}
                    </div>
                    <p className="text-gray-700">
                      {t.events.form.paymentDesc}{" "}
                      <span className="font-semibold">{t.events.form.paymentNumber}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-orange-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      {t.events.form.submit}
                    </button>
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      {t.events.form.cancel}
                    </button>
                  </div>
                </form>
              )}

              {formSent && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {t.events.form.close}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evenements;
