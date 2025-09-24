import React from "react";

const Footer = ({ t, language, setCurrentPage }) => {
  const quickLinks = [
    { key: "home",    label: t.nav.home,    icon: "fas fa-home" },
    { key: "about",   label: t.nav.about,   icon: "fas fa-users" },
    { key: "events",  label: t.nav.events,  icon: "fas fa-calendar" },
    { key: "services",label: t.nav.services,icon: "fas fa-hands-helping" },
    { key: "gallery", label: t.nav.gallery, icon: "fas fa-images" },
    { key: "contact", label: t.nav.contact, icon: "fas fa-envelope" },
  ];

  return (
    <footer className="mt-16">
      {/* Bandeau gradient */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-500" />

      <div className="bg-gray-900 text-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Bloc branding */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl flag-gradient shadow-lg" />
                <div>
                  <div className="text-2xl font-bold gradient-text">CIE</div>
                  <div className="text-xs text-gray-400">
                    {language === "fr" ? "Edmonton, Alberta" : "Edmonton, Alberta"}
                  </div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {language === "fr"
                  ? "Communauté Ivoirienne d'Edmonton — préserver la culture, renforcer la communauté."
                  : "Ivorian Community of Edmonton — preserving culture, strengthening community."}
              </p>

              {/* Réseaux sociaux */}
              <div className="flex space-x-3 pt-2">
                {[
                  { icon: "fab fa-facebook-f",  label: "Facebook"  },
                  { icon: "fab fa-instagram",  label: "Instagram" },
                  { icon: "fab fa-whatsapp",   label: "WhatsApp"  },
                  { icon: "fab fa-youtube",    label: "YouTube"   },
                ].map((s, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all shadow"
                    aria-label={s.label}
                    title={s.label}
                  >
                    <i className={s.icon}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Liens rapides */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {language === "fr" ? "Liens rapides" : "Quick Links"}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setCurrentPage(item.key)}
                    className="text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition flex items-center space-x-2"
                  >
                    <i className={`${item.icon} text-sm opacity-80`} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact rapide */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {language === "fr" ? "Nous contacter" : "Get in touch"}
              </h3>

              <div className="rounded-2xl glass-effect p-4 border border-white/10">
                <div className="flex items-start space-x-3">
                  <i className="fas fa-map-marker-alt mt-1 text-red-400" />
                  <p className="text-sm text-gray-300">{t.contact.address}</p>
                </div>
                <div className="flex items-start space-x-3 mt-3">
                  <i className="fas fa-envelope mt-1 text-blue-400" />
                  <p className="text-sm text-gray-300">{t.contact.email}</p>
                </div>
                <div className="flex items-start space-x-3 mt-3">
                  <i className="fas fa-phone mt-1 text-green-400" />
                  <p className="text-sm text-gray-300">{t.contact.phone}</p>
                </div>

                <button
                  onClick={() => setCurrentPage("contact")}
                  className="mt-4 w-full bg-gradient-to-r from-orange-500 to-green-500 text-white py-2.5 rounded-xl font-medium hover:shadow-lg transition flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-paper-plane" />
                  <span>
                    {language === "fr" ? "Écrire un message" : "Send a message"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bas de page */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Salifou Guindo —{" "}
              {language === "fr" ? "Tous droits réservés." : "All rights reserved."}
            </p>
            <div className="text-xs text-gray-500 mt-2 md:mt-0">
              {language === "fr"
                ? "Fait avec ❤ par la CIE"
                : "Made with ❤ by the CIE"}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
