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
    { name: "KOUADIO Jessica Aka", roleKey: "secretaryGeneral", image: "/img/jessica.png", isPhoto: true, category: "secretariat" },
    { name: "YAPO Ursule Elodie", roleKey: "secretaryGeneralAdjoint", image: "/img/Yapo.png", isPhoto: true, category: "secretariat" },
    
    // Finances
    { name: "KOUAKOU Nadége Élodie", roleKey: "treasurer", image: "/img/Nadege.png", isPhoto: true, category: "finances" },
    { name: "TEAH Charles John", roleKey: "auditor", image: "/img/Teah.png", isPhoto: true, category: "finances" },
    
    // Organisation
    { name: "KABLAN Chantal", roleKey: "eventOrganizer", image: "/img/Chantal.png", isPhoto: true, category: "organisation" },
    { name: "AKE Colette", roleKey: "eventOrganizer", image: "/img/Ake.png", isPhoto: true, category: "organisation" },
    { name: "Vacant", roleKey: "partnershipOrganizer", image: "👤", isPhoto: false, category: "organisation" },
    
    // Jeunesse
    { name: "YATASSAGNE Adama", roleKey: "youthResponsible", image: "/img/Yatassagne.png", isPhoto: true, category: "jeunesse" },
    { name: "KPOLO Oni Richard", roleKey: "youthResponsible", image: "/img/Kpolo.png", isPhoto: true, category: "jeunesse" },
    
    // Intégration
    { name: "KPOLO Oni Richard", roleKey: "integrationResponsible", image: "/img/Kpolo.png", isPhoto: true, category: "integration" },
    { name: "LOA Domy Fernand", roleKey: "integrationResponsible", image: "/img/Loa.png", isPhoto: true, category: "integration" },
    { name: "AKA Jean-Paul", roleKey: "integrationResponsible", image: "/img/Aka.png", isPhoto: true, category: "integration" },
    
    // Communication et Femmes
    { name: "APPAOU Marcel", roleKey: "communicationResponsible", image: "/img/Appaou.png", isPhoto: true, category: "communication" },
    { name: "KOMENAN Nina", roleKey: "womenResponsible", image: "/img/Nina.png", isPhoto: true, category: "femmes" }
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

        {/* Documents Officiels Section */}
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">
            📋 {t.about.documents.title}
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-orange-500 to-green-600 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg">
                    📄
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {t.about.documents.statutesTitle}
                </h3>
                
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  {t.about.documents.description}
                </p>
                
                <a 
                  href="/img/STATUTS ET REGLEMENT INTERIEURS  CICE.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-green-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  <i className="fas fa-download mr-3 text-xl"></i>
                  {t.about.documents.downloadButton}
                  <i className="fas fa-external-link-alt ml-3 text-lg"></i>
                </a>
                
                <div className="mt-6 text-sm text-gray-500">
                  <i className="fas fa-info-circle mr-2"></i>
                  {t.about.documents.hint}
                </div>
              </div>
            </div>
          </div>
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
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg group cursor-pointer">
                      <img
                        src={member.image}
                        alt={member.name}
                        className={`w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-150 group-hover:object-contain group-hover:bg-white group-hover:p-2 ${
                          (member.name === 'YATASSAGNE Adama' || member.name === 'AKA Jean-Paul' || member.name === 'KOUAKOU Nadége Élodie' || member.name === 'Coulibaly Tchawa Zainab' || member.name === 'KOMENAN Nina' || member.name === 'YAPO Ursule Elodie' || member.name === 'APPAOU Marcel') ? 'object-top' : ''
                        }`}
                        style={(member.name === 'YATASSAGNE Adama' || member.name === 'AKA Jean-Paul' || member.name === 'KOUAKOU Nadége Élodie' || member.name === 'Coulibaly Tchawa Zainab' || member.name === 'KOMENAN Nina' || member.name === 'YAPO Ursule Elodie' || member.name === 'APPAOU Marcel') ? {objectPosition: 'center top'} : {}}
                        onLoad={() => console.log(`Image chargée: ${member.image}`)}
                        onError={(e) => {
                          console.error(`Image non trouvée: ${member.image}`);
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
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
                  {member.isPhoto ? (
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg group cursor-pointer">
                      <img
                        src={member.image}
                        alt={member.name}
                        className={`w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-150 group-hover:object-contain group-hover:bg-white group-hover:p-2 ${
                          (member.name === 'YATASSAGNE Adama' || member.name === 'AKA Jean-Paul' || member.name === 'KOUAKOU Nadége Élodie' || member.name === 'Coulibaly Tchawa Zainab' || member.name === 'KOMENAN Nina' || member.name === 'YAPO Ursule Elodie' || member.name === 'APPAOU Marcel') ? 'object-top' : ''
                        }`}
                        style={(member.name === 'YATASSAGNE Adama' || member.name === 'AKA Jean-Paul' || member.name === 'KOUAKOU Nadége Élodie' || member.name === 'Coulibaly Tchawa Zainab' || member.name === 'KOMENAN Nina' || member.name === 'YAPO Ursule Elodie' || member.name === 'APPAOU Marcel') ? {objectPosition: 'center top'} : {}}
                        onLoad={() => console.log(`Image chargée: ${member.image}`)}
                        onError={(e) => {
                          console.error(`Image non trouvée: ${member.image}`);
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-6xl mb-4">{member.image}</div>
                  )}
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
                  {member.isPhoto ? (
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg group cursor-pointer">
                      <img
                        src={member.image}
                        alt={member.name}
                        className={`w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-150 group-hover:object-contain group-hover:bg-white group-hover:p-2 ${
                          (member.name === 'YATASSAGNE Adama' || member.name === 'AKA Jean-Paul' || member.name === 'KOUAKOU Nadége Élodie' || member.name === 'Coulibaly Tchawa Zainab' || member.name === 'KOMENAN Nina' || member.name === 'YAPO Ursule Elodie' || member.name === 'APPAOU Marcel') ? 'object-top' : ''
                        }`}
                        style={(member.name === 'YATASSAGNE Adama' || member.name === 'AKA Jean-Paul' || member.name === 'KOUAKOU Nadége Élodie' || member.name === 'Coulibaly Tchawa Zainab' || member.name === 'KOMENAN Nina' || member.name === 'YAPO Ursule Elodie' || member.name === 'APPAOU Marcel') ? {objectPosition: 'center top'} : {}}
                        onLoad={() => console.log(`Image chargée: ${member.image}`)}
                        onError={(e) => {
                          console.error(`Image non trouvée: ${member.image}`);
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-6xl mb-4">{member.image}</div>
                  )}
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
                  {member.isPhoto ? (
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg group cursor-pointer">
                      <img
                        src={member.image}
                        alt={member.name}
                        className={`w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-150 group-hover:object-contain group-hover:bg-white group-hover:p-2 ${
                          (member.name === 'YATASSAGNE Adama' || member.name === 'AKA Jean-Paul' || member.name === 'KOUAKOU Nadége Élodie' || member.name === 'Coulibaly Tchawa Zainab' || member.name === 'KOMENAN Nina' || member.name === 'YAPO Ursule Elodie' || member.name === 'APPAOU Marcel') ? 'object-top' : ''
                        }`}
                        style={(member.name === 'YATASSAGNE Adama' || member.name === 'AKA Jean-Paul' || member.name === 'KOUAKOU Nadége Élodie' || member.name === 'Coulibaly Tchawa Zainab' || member.name === 'KOMENAN Nina' || member.name === 'YAPO Ursule Elodie' || member.name === 'APPAOU Marcel') ? {objectPosition: 'center top'} : {}}
                        onLoad={() => console.log(`Image chargée: ${member.image}`)}
                        onError={(e) => {
                          console.error(`Image non trouvée: ${member.image}`);
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-6xl mb-4">{member.image}</div>
                  )}
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
                  {member.isPhoto ? (
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg group cursor-pointer">
                      <img
                        src={member.image}
                        alt={member.name}
                        className={`w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-150 group-hover:object-contain group-hover:bg-white group-hover:p-2 ${
                          (member.name === 'YATASSAGNE Adama' || member.name === 'AKA Jean-Paul' || member.name === 'KOUAKOU Nadége Élodie' || member.name === 'Coulibaly Tchawa Zainab' || member.name === 'KOMENAN Nina' || member.name === 'YAPO Ursule Elodie' || member.name === 'APPAOU Marcel') ? 'object-top' : ''
                        }`}
                        style={(member.name === 'YATASSAGNE Adama' || member.name === 'AKA Jean-Paul' || member.name === 'KOUAKOU Nadége Élodie' || member.name === 'Coulibaly Tchawa Zainab' || member.name === 'KOMENAN Nina' || member.name === 'YAPO Ursule Elodie' || member.name === 'APPAOU Marcel') ? {objectPosition: 'center top'} : {}}
                        onLoad={() => console.log(`Image chargée: ${member.image}`)}
                        onError={(e) => {
                          console.error(`Image non trouvée: ${member.image}`);
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-6xl mb-4">{member.image}</div>
                  )}
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
                  {member.isPhoto ? (
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg group cursor-pointer">
                      <img
                        src={member.image}
                        alt={member.name}
                        className={`w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-150 group-hover:object-contain group-hover:bg-white group-hover:p-2 ${
                          (member.name === 'YATASSAGNE Adama' || member.name === 'AKA Jean-Paul' || member.name === 'KOUAKOU Nadége Élodie' || member.name === 'Coulibaly Tchawa Zainab' || member.name === 'KOMENAN Nina' || member.name === 'YAPO Ursule Elodie' || member.name === 'APPAOU Marcel') ? 'object-top' : ''
                        }`}
                        style={(member.name === 'YATASSAGNE Adama' || member.name === 'AKA Jean-Paul' || member.name === 'KOUAKOU Nadége Élodie' || member.name === 'Coulibaly Tchawa Zainab' || member.name === 'KOMENAN Nina' || member.name === 'YAPO Ursule Elodie' || member.name === 'APPAOU Marcel') ? {objectPosition: 'center top'} : {}}
                        onLoad={() => console.log(`Image chargée: ${member.image}`)}
                        onError={(e) => {
                          console.error(`Image non trouvée: ${member.image}`);
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-6xl mb-4">{member.image}</div>
                  )}
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
                  {member.isPhoto ? (
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg group cursor-pointer">
                      <img
                        src={member.image}
                        alt={member.name}
                        className={`w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-150 group-hover:object-contain group-hover:bg-white group-hover:p-2 ${
                          (member.name === 'YATASSAGNE Adama' || member.name === 'AKA Jean-Paul' || member.name === 'KOUAKOU Nadége Élodie' || member.name === 'Coulibaly Tchawa Zainab' || member.name === 'KOMENAN Nina' || member.name === 'YAPO Ursule Elodie' || member.name === 'APPAOU Marcel') ? 'object-top' : ''
                        }`}
                        style={(member.name === 'YATASSAGNE Adama' || member.name === 'AKA Jean-Paul' || member.name === 'KOUAKOU Nadége Élodie' || member.name === 'Coulibaly Tchawa Zainab' || member.name === 'KOMENAN Nina' || member.name === 'YAPO Ursule Elodie' || member.name === 'APPAOU Marcel') ? {objectPosition: 'center top'} : {}}
                        onLoad={() => console.log(`Image chargée: ${member.image}`)}
                        onError={(e) => {
                          console.error(`Image non trouvée: ${member.image}`);
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-6xl mb-4">{member.image}</div>
                  )}
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
