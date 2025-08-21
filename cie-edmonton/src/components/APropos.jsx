import React from 'react';

const APropos = ({ t }) => {
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
    { name: "Kouassi Adjé", role: "Président", image: "👨🏿‍💼" },
    { name: "Aminata Traoré", role: "Vice-Présidente", image: "👩🏿‍💼" },
    { name: "Yao N'Guessan", role: "Secrétaire", image: "👨🏿‍💻" }
  ];

  // Map simple FR -> key -> t.about.roles[key]
  const roleKeyMap = {
    "Président": "president",
    "Vice-Présidente": "vicePresident",
    "Secrétaire": "secretary"
  };

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
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="card-hover bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-orange-600 font-medium">
                  {t.about.roles?.[roleKeyMap[member.role]] ?? member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APropos;
