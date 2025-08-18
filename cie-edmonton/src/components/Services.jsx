import React from 'react';

const Services = ({ t }) => {
  const services = [
    {
      title: t.services.integration,
      description: t.services.integrationDesc,
      icon: "fas fa-handshake",
      color: "from-orange-500 to-red-500",
      features: ["Aide aux démarches", "Orientation sociale", "Accompagnement personnalisé"]
    },
    {
      title: t.services.cultural,
      description: t.services.culturalDesc,
      icon: "fas fa-drum",
      color: "from-green-500 to-emerald-500",
      features: ["Cours de danse", "Ateliers cuisine", "Transmission culturelle"]
    },
    {
      title: t.services.networking,
      description: t.services.networkingDesc,
      icon: "fas fa-network-wired",
      color: "from-blue-500 to-purple-500",
      features: ["Événements pro", "Mentorat", "Opportunités d'affaires"]
    },
    {
      title: t.services.education,
      description: t.services.educationDesc,
      icon: "fas fa-graduation-cap",
      color: "from-purple-500 to-pink-500",
      features: ["Cours d'anglais", "Culture pour enfants", "Soutien scolaire"]
    },
    {
      title: t.services.support,
      description: t.services.supportDesc,
      icon: "fas fa-heart",
      color: "from-pink-500 to-red-500",
      features: ["Aide d'urgence", "Soutien moral", "Réseau d'entraide"]
    },
    {
      title: t.services.legal,
      description: t.services.legalDesc,
      icon: "fas fa-balance-scale",
      color: "from-yellow-500 to-orange-500",
      features: ["Conseils juridiques", "Aide immigration", "Orientation légale"]
    }
  ];

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold gradient-text mb-6">
            {t.services.title}
          </h1>
          <p className="text-2xl text-gray-600">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="card-hover bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center text-white text-2xl shadow-lg`}>
                <i className={service.icon}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-center">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <i className="fas fa-check-circle text-green-500 mr-3"></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
