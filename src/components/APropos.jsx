// src/components/APropos.jsx
import React from 'react';

const APropos = ({ t, language }) => {
  const sections = [
    {
      title: t.about.mission,
      content: t.about.missionText,
      icon: "fas fa-bullseye",
      color: "from-orange-500 to-red-500"
    },
    {
      title: t.about.values,
      content: t.about.valuesText,
      icon: "fas fa-heart",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: t.about.vision,
      content: t.about.visionText,
      icon: "fas fa-eye",
      color: "from-blue-500 to-purple-500"
    },
    {
      title: t.about.history,
      content: t.about.historyText,
      icon: "fas fa-history",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const teamMembers = [
    // Direction
    { name: "Ambroise Gnoan", roleKey: "president", image: "/img/president.jpg", isPhoto: true, category: "direction" },
    { name: "Coulibaly Tchawa Zainab", roleKey: "vicePresident", image: "/img/vicepresidente.png", isPhoto: true, category: "direction" },
    
    // Secrétariat
    { name: "KOUADIO Jessica Aka", roleKey: "secretaryGeneral", image: "👩🏿‍💼", isPhoto: false, category: "secretariat" },
    { name: "YAPO Ursule Elodie", roleKey: "secretaryGeneralAdjoint", image: "👩🏿‍💼", isPhoto: false, category: "secretariat" },
    
    // Finances
    { name: "KOUAKOU Nadége Élodie", roleKey: "treasurer", image: "👩🏿‍💼", isPhoto: false, category: "finances" },
    { name: "TEAH Charles John", roleKey: "auditor", image: "👨🏿‍💼", isPhoto: false, category: "finances" },
    
    // Organisation
    { name: "KABLAN Chantal", roleKey: "eventOrganizer", image: "👩🏿‍💼", isPhoto: false, category: "organisation" },
    { name: "AKE Colette", roleKey: "eventOrganizer", image: "👩🏿‍💼", isPhoto: false, category: "organisation" },
    { name: "Vacant", roleKey: "partnershipOrganizer", image: "👤", isPhoto: false, category: "organisation" },
    
    // Jeunesse
    { name: "YATASSAGNE Adama", roleKey: "youthResponsible", image: "👨🏿‍💼", isPhoto: false, category: "jeunesse" },
    { name: "KPOLO Oni Richard", roleKey: "youthResponsible", image: "👨🏿‍💼", isPhoto: false, category: "jeunesse" },
    
    // Intégration
    { name: "KPOLO Oni Richard", roleKey: "integrationResponsible", image: "👨🏿‍💼", isPhoto: false, category: "integration" },
    { name: "LOA Domy Fernand", roleKey: "integrationResponsible", image: "👨🏿‍💼", isPhoto: false, category: "integration" },
    { name: "AKA Jean-Paul", roleKey: "integrationResponsible", image: "👨🏿‍💼", isPhoto: false, category: "integration" },
    
    // Communication et Femmes
    { name: "APPAOU Marcel", roleKey: "communicationResponsible", image: "👨🏿‍💼", isPhoto: false, category: "communication" },
    { name: "KOMENAN Nina", roleKey: "womenResponsible", image: "👩🏿‍💼", isPhoto: false, category: "femmes" }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold gradient-text mb-6">
            {t.about.title}
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t.about.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <div key={index} className="card-hover bg-white p-8 rounded-2xl shadow-xl">
              <div className="flex items-start space-x-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${section.color} flex items-center justify-center text-white text-2xl shadow-lg flex-shrink-0`}>
                  <i className={section.icon}></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">
            {t.about.teamTitle}
          </h2>
          
          {/* Direction */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-700 mb-8">{t.about.teamSections.direction}</h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {teamMembers.filter(member => member.category === "direction").map((member, index) => (
                <div key={index} className="card-hover bg-white p-8 rounded-2xl shadow-lg text-center">
                  {member.isPhoto ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 mx-auto rounded-full mb-4 object-cover shadow-lg"
                      onLoad={() => console.log(`Image chargée: ${member.image}`)}
                      onError={(e) => {
                        console.error(`Image non trouvée: ${member.image}`);
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-6xl mb-4">{member.image}</div>
                  )}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-orange-600 font-medium">{t.about.roles[member.roleKey]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Secrétariat */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-700 mb-8">{t.about.teamSections.secretariat}</h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {teamMembers.filter(member => member.category === "secretariat").map((member, index) => (
                <div key={index} className="card-hover bg-white p-8 rounded-2xl shadow-lg text-center">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-orange-600 font-medium">{t.about.roles[member.roleKey]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Finances */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-700 mb-8">{t.about.teamSections.finances}</h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {teamMembers.filter(member => member.category === "finances").map((member, index) => (
                <div key={index} className="card-hover bg-white p-8 rounded-2xl shadow-lg text-center">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-orange-600 font-medium">{t.about.roles[member.roleKey]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Organisation */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-700 mb-8">{t.about.teamSections.organisation}</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.filter(member => member.category === "organisation").map((member, index) => (
                <div key={index} className="card-hover bg-white p-8 rounded-2xl shadow-lg text-center">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-orange-600 font-medium">{t.about.roles[member.roleKey]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Jeunesse */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-700 mb-8">{t.about.teamSections.jeunesse}</h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {teamMembers.filter(member => member.category === "jeunesse").map((member, index) => (
                <div key={index} className="card-hover bg-white p-8 rounded-2xl shadow-lg text-center">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-orange-600 font-medium">{t.about.roles[member.roleKey]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Intégration */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-700 mb-8">{t.about.teamSections.integration}</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.filter(member => member.category === "integration").map((member, index) => (
                <div key={index} className="card-hover bg-white p-8 rounded-2xl shadow-lg text-center">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-orange-600 font-medium">{t.about.roles[member.roleKey]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Communication et Femmes */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-700 mb-8">{t.about.teamSections.communication}</h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {teamMembers.filter(member => member.category === "communication" || member.category === "femmes").map((member, index) => (
                <div key={index} className="card-hover bg-white p-8 rounded-2xl shadow-lg text-center">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-orange-600 font-medium">{t.about.roles[member.roleKey]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APropos;
