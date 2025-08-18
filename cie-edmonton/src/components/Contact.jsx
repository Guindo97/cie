import React, { useState } from 'react';

const Contact = ({ t }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message envoyé avec succès ! Nous vous répondrons bientôt.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: "fas fa-map-marker-alt",
      title: "Adresse / Address",
      content: t.contact.address,
      color: "text-red-500"
    },
    {
      icon: "fas fa-envelope",
      title: "Email",
      content: t.contact.email,
      color: "text-blue-500"
    },
    {
      icon: "fas fa-phone",
      title: "Téléphone / Phone",
      content: t.contact.phone,
      color: "text-green-500"
    }
  ];

  const socialMedia = [
    { icon: "fab fa-facebook", color: "bg-blue-600", name: "Facebook" },
    { icon: "fab fa-instagram", color: "bg-pink-600", name: "Instagram" },
    { icon: "fab fa-whatsapp", color: "bg-green-600", name: "WhatsApp" },
    { icon: "fab fa-youtube", color: "bg-red-600", name: "YouTube" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold gradient-text mb-6">
            {t.contact.title}
          </h1>
          <p className="text-2xl text-gray-600">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Informations de contact</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`text-2xl ${info.color} mt-1`}>
                      <i className={info.icon}></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">{info.title}</h3>
                      <p className="text-gray-600">{info.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Suivez-nous</h3>
              <div className="flex space-x-4">
                {socialMedia.map((social, index) => (
                  <button
                    key={index}
                    className={`${social.color} text-white w-12 h-12 rounded-xl flex items-center justify-center hover:shadow-lg transform hover:scale-110 transition-all duration-300`}
                    title={social.name}
                    aria-label={social.name}
                  >
                    <i className={social.icon}></i>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t.contact.form.name}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t.contact.form.email}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t.contact.form.subject}
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t.contact.form.message}
                </label>
                <textarea
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-paper-plane"></i>
                <span>{t.contact.form.send}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
