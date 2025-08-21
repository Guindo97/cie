import React, { useEffect, useRef, useState } from 'react';

/** Petit composant compteur animé (entier uniquement) */
const Counter = ({ end = 0, duration = 1200, suffix = "" }) => {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const start = () => {
      if (startedRef.current) return; // éviter plusieurs démarrages
      startedRef.current = true;

      const startTime = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.round(progress * end);
        setValue(current);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    };

    // Lance l'animation quand visible
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
};

const Accueil = ({ t, setCurrentPage }) => {
  // Deux cartes avec compteur (1 et 4), 24 et 8 restent statiques
  const stats = [
    { type: 'counter', end: 250, suffix: '+', label: t.home.stats.members, icon: 'fas fa-users' },
    { type: 'static', text: '24', label: t.home.stats.events, icon: 'fas fa-calendar-alt' },
    { type: 'static', text: '8', label: t.home.stats.years, icon: 'fas fa-clock' },
    { type: 'counter', end: 160, suffix: '+', label: t.home.stats.families, icon: 'fas fa-home' },
  ];

  const features = [
    {
      icon: 'fas fa-drum',
      title: t.home.features.culture.title,
      desc: t.home.features.culture.desc,
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: 'fas fa-handshake',
      title: t.home.features.integration.title,
      desc: t.home.features.integration.desc,
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: 'fas fa-heart',
      title: t.home.features.community.title,
      desc: t.home.features.community.desc,
      color: 'from-blue-500 to-purple-500',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero-gradient min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-shadow leading-tight">
                {t.home.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                {t.home.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => setCurrentPage('contact')}
                  className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-user-plus"></i>
                  <span>{t.home.joinButton}</span>
                </button>
                <button
                  onClick={() => setCurrentPage('about')}
                  className="glass-effect text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-info-circle"></i>
                  <span>{t.home.learnButton}</span>
                </button>
              </div>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="w-80 h-80 mx-auto flag-gradient rounded-full animate-float shadow-2xl flex items-center justify-center">
                  <span className="text-8xl animate-pulse-slow">🇨🇮</span>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full animate-ping"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/30 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center card-hover bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg"
              >
                <div className="text-4xl text-orange-500 mb-4">
                  <i className={stat.icon}></i>
                </div>

                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {stat.type === 'counter' ? (
                    <Counter end={stat.end} suffix={stat.suffix} />
                  ) : (
                    stat.text
                  )}
                </div>

                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-orange-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {t.home.whyJoin}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.home.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-hover bg-white p-8 rounded-2xl shadow-lg text-center"
              >
                <div
                  className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white text-2xl shadow-lg`}
                >
                  <i className={feature.icon}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accueil;
