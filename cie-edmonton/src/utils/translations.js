export const translations = {
  fr: {
    nav: {
      home: "Accueil",
      about: "À propos de nous",
      events: "Événements",
      services: "Services",
      gallery: "Galerie",
      contact: "Contact"
    },
    home: {
      title: "Bienvenue dans la Communauté Ivoirienne d'Edmonton",
      subtitle: "Ensemble, nous préservons notre culture et construisons notre avenir au Canada",
      description:
        "Notre communauté dynamique rassemble les Ivoiriens et amis de la Côte d'Ivoire vivant à Edmonton et dans la région de l'Alberta. Nous organisons des événements culturels enrichissants, offrons du soutien personnalisé aux nouveaux arrivants et maintenons nos traditions ancestrales vivantes dans le respect de notre nouvelle patrie canadienne.",
      joinButton: "Rejoignez-nous",
      learnButton: "En savoir plus",
      whyJoin: "Pourquoi nous rejoindre ?",
      stats: {
        members: "Membres actifs",
        events: "Événements par an",
        years: "Années d'existence",
        families: "Familles aidées"
      },
      features: {
        culture: { title: "Préservation Culturelle", desc: "Maintenir vivantes nos traditions ivoiriennes" },
        integration: { title: "Intégration Réussie", desc: "Accompagner chaque nouveau membre" },
        community: { title: "Esprit Communautaire", desc: "Créer des liens durables et authentiques" }
      }
    },
    about: {
      title: "À propos de notre communauté",
      subtitle: "Une famille unie par la culture et l'entraide",
      mission: "Notre Mission",
      missionText:
        "Créer un environnement accueillant et bienveillant pour tous les Ivoiriens à Edmonton, préserver notre riche patrimoine culturel ancestral et faciliter une intégration harmonieuse dans la société canadienne multiculturelle.",
      values: "Nos Valeurs",
      valuesText:
        "Solidarité inconditionnelle, respect mutuel, entraide fraternelle et célébration joyeuse de notre diversité culturelle unique.",
      vision: "Notre Vision",
      visionText:
        "Devenir la référence communautaire pour tous les Ivoiriens de l'Alberta, en créant un pont culturel entre la Côte d'Ivoire et le Canada.",
      history: "Notre Histoire",
      historyText:
        "Fondée en 2015 par un groupe de familles ivoiriennes passionnées, notre communauté a grandi pour devenir un pilier essentiel de la diaspora ivoirienne en Alberta.",
      teamTitle: "Notre Équipe",
      teamSections: {
        direction: "Direction",
        secretariat: "Secrétariat",
        finances: "Finances",
        organisation: "Organisation",
        jeunesse: "Jeunesse",
        integration: "Intégration",
        communication: "Communication & Femmes"
      },
      roles: {
        president: "Président",
        vicePresident: "Vice-Présidente",
        secretary: "Secrétaire",
        secretaryGeneral: "Secrétaire Générale",
        secretaryGeneralAdjoint: "Secrétaire Générale Adjointe",
        treasurer: "Trésorière / Responsable Comité des Adhésions",
        auditor: "Commissaire aux comptes",
        eventOrganizer: "Responsable Comité d'organisation des événements",
        partnershipOrganizer: "Responsable Comité d'organisation des partenariats",
        youthResponsible: "Responsable Comité de jeunesse",
        integrationResponsible: "Responsable Comité d'intégration des nouveaux arrivants",
        communicationResponsible: "Responsable Comité communication",
        womenResponsible: "Responsable Comité des Femmes",
        vacant: "Vacant"
      }
    },
    events: {
      title: "Nos Événements",
      subtitle: "Célébrons ensemble notre culture",
      upcoming: "Événements à venir",
      past: "Événements passés",
      register: "S'inscrire",
      form: {
        title: "Inscription à l'événement",
        firstName: "Prénom",
        lastName: "Nom",
        eventName: "Nom de l'événement",
        paymentTitle: "Paiement par Interac",
        paymentDesc: "Veuillez envoyer votre paiement par virement Interac/e-Transfer au numéro suivant :",
        paymentNumber: "+1 (780) 720-3996",
        submit: "Envoyer l'inscription",
        cancel: "Annuler",
        close: "Fermer",
        success: "Merci ! Votre demande d'inscription a été prise en compte.",
        summaryName: "Nom",
        summaryEvent: "Événement",
        summaryPayment: "Paiement Interac au"
      },
      // Contenu TRADUIT des cartes (FR)
      items: {
        upcoming: [
          {
            key: "independence2024",
            title: "Fête de l'Indépendance 2024",
            date: "7 août 2024",
            time: "18h00 - 23h00",
            location: "Centre communautaire d'Edmonton",
            description:
              "Célébration de l'indépendance de la Côte d'Ivoire avec spectacles, cuisine traditionnelle et danses.",
            image: "🎉",
            price: "Gratuit"
          },
          {
            key: "fallCulturalNight",
            title: "Soirée Culturelle Automne",
            date: "15 septembre 2024",
            time: "19h00 - 22h00",
            location: "Salle des fêtes Alberta",
            description:
              "Soirée dédiée à la culture ivoirienne avec contes, musique et dégustation.",
            image: "🎭",
            price: "15$ CAD"
          },
          {
            key: "ivorianCookingWorkshop",
            title: "Atelier Cuisine Ivoirienne",
            date: "22 octobre 2024",
            time: "14h00 - 17h00",
            location: "École culinaire d'Edmonton",
            description:
              "Apprenez à préparer les plats traditionnels ivoiriens avec nos chefs.",
            image: "👩‍🍳",
            price: "25$ CAD"
          },
          {
            key: "attiekeWomenDay",
            title: "Journée spéciale Attiéké des femmes",
            date: "15 novembre 2024",
            time: "10h00 - 16h00",
            location: "Centre communautaire d'Edmonton",
            description:
              "Célébration spéciale dédiée aux femmes avec dégustation d'attiéké et activités culturelles.",
            image: "/img/attieke.jpg",
            price: "Gratuit"
          }
        ],
        past: [
          { key: "barbecueAccueil2025", title: "Barbecue d'accueil des nouveaux arrivants", date: "30 août 2024", participants: "90 personnes", image: "/img/1.jpg", description: "Célébration d'accueil pour les nouveaux arrivants ivoiriens à Edmonton avec réseautage, conseils d'insertion et partage d'expériences." },
          { key: "openHouseDay", title: "Journée Portes Ouvertes", date: "12 mai 2024", participants: "85 personnes", image: "🏠" },
          { key: "easterFestival", title: "Festival de Pâques", date: "31 mars 2024", participants: "120 personnes", image: "🐰" },
          { key: "yearEndGala", title: "Gala de Fin d'Année", date: "16 décembre 2023", participants: "200 personnes", image: "✨" }
        ]
      }
    },
    services: {
      title: "Nos Services",
      subtitle: "Nous sommes là pour vous accompagner",
      integration: "Aide à l'intégration",
      integrationDesc:
        "Accompagnement personnalisé des nouveaux arrivants dans leurs démarches administratives et sociales",
      cultural: "Activités culturelles",
      culturalDesc:
        "Cours de danse traditionnelle, ateliers cuisine ivoirienne et transmission des traditions",
      networking: "Réseautage professionnel",
      networkingDesc:
        "Connexions professionnelles et opportunités d'affaires au sein de notre réseau",
      education: "Éducation des enfants",
      educationDesc:
        "Cours de français et transmission de la culture ivoirienne aux jeunes générations",
      support: "Soutien communautaire",
      supportDesc:
        "Aide d'urgence et soutien moral lors de moments difficiles",
      legal: "Assistance juridique",
      legalDesc:
        "Orientation et conseils pour les questions d'immigration et légales",
      features: {
        integration: ["Aide aux démarches", "Orientation sociale", "Accompagnement personnalisé"],
        cultural: ["Cours de danse", "Ateliers cuisine", "Transmission culturelle"],
        networking: ["Événements pro", "Mentorat", "Opportunités d'affaires"],
        education: ["Cours de français", "Culture pour enfants", "Soutien scolaire"],
        support: ["Aide d'urgence", "Soutien moral", "Réseau d'entraide"],
        legal: ["Conseils juridiques", "Aide immigration", "Orientation légale"]
      }
    },
    gallery: {
      title: "Galerie",
      subtitle: "Nos plus beaux moments en images",
      more: "Voir plus",
      cardDesc: "Une belle célébration de notre communauté",
      categories: {
        all: "Tous",
        events: "Événements",
        culture: "Culture",
        community: "Communauté",
        family: "Famille",
        celebrations: "Célébrations",
        sport: "Sport",
        commerce: "Commerce"
      },
      items: {
        independence2023: { 
          title: "Fête de l'Indépendance 2023",
          image: "/img/happy.jpg"
        },
        cookingWorkshop: { 
          title: "Atelier Cuisine Traditionnelle",
          image: "/img/cuisine.webp"
        },
        danceNight: { 
          title: "Soirée Danse Ivoirienne",
          image: "/img/danse.png"
        },
        generalAssembly: { 
          title: "Assemblée Générale",
          image: "/img/ag.png"
        },
        kidsFestival: { 
          title: "Festival des Enfants",
          image: "/img/enfants.png"
        },
        weddingCeremony: { 
          title: "Cérémonie de Mariage",
          image: "/img/weeding.png"
        },
        footballMatch: { 
          title: "Match de Football",
          image: "/img/foot.png"
        },
        africanMarket: { 
          title: "Marché Africain",
          image: "/img/marché.jpg"
        },
        barbecueAccueil: { 
          title: "Barbecue d'accueil des nouveaux arrivants",
          date: "30 août 2024",
          location: "Queen Mary Park, Edmonton",
          participants: "90 personnes",
          image: "/img/1.jpg",
          photos: ["/img/1.jpg"]
        }
      }
    },
    contact: {
      title: "Contactez-nous",
      subtitle: "Nous sommes à votre écoute",
      address: "Edmonton, Alberta, Canada",
      email: "bureaucice2022@gmail.com",
      phone: "+1 (780) 720-3996",
      sectionTitles: { info: "Informations de contact", follow: "Suivez-nous" },
      form: {
        name: "Nom complet",
        email: "Adresse email",
        subject: "Sujet",
        message: "Votre message",
        send: "Envoyer le message",
        titleBox: "Envoyez-nous un message"
      }
    },
    admin: {
      title: "Administration",
      subtitle: "Gestion du contenu du site",
      login: "Connexion",
      password: "Mot de passe",
      loginButton: "Se connecter",
      logout: "Déconnexion",
      gallery: {
        title: "Gestion de la Galerie",
        addImage: "Ajouter une image",
        addVideo: "Ajouter une vidéo",
        titleLabel: "Titre",
        descriptionLabel: "Description",
        fileLabel: "Fichier",
        uploadButton: "Télécharger",
        cancelButton: "Annuler",
        successMessage: "Image ajoutée avec succès !",
        errorMessage: "Erreur lors de l'ajout de l'image",
        maxSize: "Taille maximale : 50MB",
        supportedFormats: "Formats supportés : JPG, PNG, GIF, MP4, MOV"
      },
      events: {
        title: "Gestion des Événements",
        addEvent: "Ajouter un événement",
        editEvent: "Modifier l'événement",
        deleteEvent: "Supprimer l'événement",
        eventTitle: "Titre de l'événement",
        eventDate: "Date",
        eventLocation: "Lieu",
        eventDescription: "Description",
        eventImage: "Image",
        saveButton: "Enregistrer",
        cancelButton: "Annuler",
        deleteConfirm: "Êtes-vous sûr de vouloir supprimer cet événement ?"
      }
    }
  },

  en: {
    nav: {
      home: "Home",
      about: "About Us",
      events: "Events",
      services: "Services",
      gallery: "Gallery",
      contact: "Contact"
    },
    home: {
      title: "Welcome to the Ivorian Community of Edmonton",
      subtitle: "Together, we preserve our culture and build our future in Canada",
      description:
        "Our dynamic community brings together Ivorians and friends of Côte d'Ivoire living in Edmonton and the Alberta region. We organize enriching cultural events, provide personalized support to newcomers, and keep our ancestral traditions alive while respecting our new Canadian homeland.",
      joinButton: "Join Us",
      learnButton: "Learn More",
      whyJoin: "Why join us?",
      stats: {
        members: "Active Members",
        events: "Events per Year",
        years: "Years of Existence",
        families: "Families Helped"
      },
      features: {
        culture: { title: "Cultural Preservation", desc: "Keeping our Ivorian traditions alive" },
        integration: { title: "Successful Integration", desc: "Supporting every new member" },
        community: { title: "Community Spirit", desc: "Creating lasting and authentic bonds" }
      }
    },
    about: {
      title: "About Our Community",
      subtitle: "A family united by culture and mutual aid",
      mission: "Our Mission",
      missionText:
        "To create a welcoming and caring environment for all Ivorians in Edmonton, preserve our rich ancestral cultural heritage, and facilitate harmonious integration into multicultural Canadian society.",
      values: "Our Values",
      valuesText:
        "Unconditional solidarity, mutual respect, fraternal mutual aid, and joyful celebration of our unique cultural diversity.",
      vision: "Our Vision",
      visionText:
        "To become the community reference for all Ivorians in Alberta, creating a cultural bridge between Côte d'Ivoire and Canada.",
      history: "Our History",
      historyText:
        "Founded in 2015 by a group of passionate Ivorian families, our community has grown to become an essential pillar of the Ivorian diaspora in Alberta.",
      teamTitle: "Our Team",
      teamSections: {
        direction: "Leadership",
        secretariat: "Secretariat",
        finances: "Finances",
        organisation: "Organization",
        jeunesse: "Youth",
        integration: "Integration",
        communication: "Communication & Women"
      },
      roles: {
        president: "President",
        vicePresident: "Vice President",
        secretary: "Secretary",
        secretaryGeneral: "General Secretary",
        secretaryGeneralAdjoint: "Deputy General Secretary",
        treasurer: "Treasurer / Membership Committee Head",
        auditor: "Auditor",
        eventOrganizer: "Event Organization Committee Head",
        partnershipOrganizer: "Partnership Organization Committee Head",
        youthResponsible: "Youth Committee Head",
        integrationResponsible: "Newcomer Integration Committee Head",
        communicationResponsible: "Communication Committee Head",
        womenResponsible: "Women's Committee Head",
        vacant: "Vacant"
      }
    },
    events: {
      title: "Our Events",
      subtitle: "Let's celebrate our culture together",
      upcoming: "Upcoming Events",
      past: "Past Events",
      register: "Register",
      form: {
        title: "Event Registration",
        firstName: "First name",
        lastName: "Last name",
        eventName: "Event name",
        paymentTitle: "Interac Payment",
        paymentDesc: "Please send your payment via Interac e-Transfer to the following number:",
        paymentNumber: "+1 (780) 720-3996",
        submit: "Submit registration",
        cancel: "Cancel",
        close: "Close",
        success: "Thank you! Your registration request has been received.",
        summaryName: "Name",
        summaryEvent: "Event",
        summaryPayment: "Interac payment to"
      },
      // Card content (EN)
      items: {
        upcoming: [
          {
            key: "independence2024",
            title: "Independence Day 2024",
            date: "August 7, 2024",
            time: "6:00 PM – 11:00 PM",
            location: "Edmonton Community Centre",
            description:
              "Celebrate Côte d'Ivoire's Independence with performances, traditional cuisine, and dances.",
            image: "🎉",
            price: "Free"
          },
          {
            key: "fallCulturalNight",
            title: "Fall Cultural Night",
            date: "September 15, 2024",
            time: "7:00 PM – 10:00 PM",
            location: "Alberta Banquet Hall",
            description:
              "An evening dedicated to Ivorian culture with storytelling, music, and tastings.",
            image: "🎭",
            price: "CAD $15"
          },
          {
            key: "ivorianCookingWorkshop",
            title: "Ivorian Cooking Workshop",
            date: "October 22, 2024",
            time: "2:00 PM – 5:00 PM",
            location: "Edmonton Culinary School",
            description:
              "Learn how to prepare traditional Ivorian dishes with our chefs.",
            image: "👩‍🍳",
            price: "CAD $25"
          },
          {
            key: "attiekeWomenDay",
            title: "Special Attiéké Women's Day",
            date: "November 15, 2024",
            time: "10:00 AM – 4:00 PM",
            location: "Edmonton Community Centre",
            description:
              "Special celebration dedicated to women with attiéké tasting and cultural activities.",
            image: "/img/attieke.jpg",
            price: "Free"
          }
        ],
        past: [
          { key: "barbecueAccueil2025", title: "Welcome BBQ for Newcomers", date: "August 30, 2024", participants: "90 people", image: "/img/1.jpg", description: "Welcome celebration for new Ivorian arrivals in Edmonton with networking, integration advice and experience sharing." },
          { key: "openHouseDay", title: "Open House Day", date: "May 12, 2024", participants: "85 people", image: "🏠" },
          { key: "easterFestival", title: "Easter Festival", date: "March 31, 2024", participants: "120 people", image: "🐰" },
          { key: "yearEndGala", title: "Year-End Gala", date: "December 16, 2023", participants: "200 people", image: "✨" }
        ]
      }
    },
    services: {
      title: "Our Services",
      subtitle: "We are here to support you",
      integration: "Integration Support",
      integrationDesc:
        "Personalized support for newcomers in their administrative and social procedures",
      cultural: "Cultural Activities",
      culturalDesc:
        "Traditional dance classes, Ivorian cooking workshops, and tradition transmission",
      networking: "Professional Networking",
      networkingDesc:
        "Professional connections and business opportunities within our network",
      education: "Children's Education",
      educationDesc:
        "French classes and transmission of Ivorian culture to younger generations",
      support: "Community Support",
      supportDesc:
        "Emergency aid and moral support during difficult times",
      legal: "Legal Assistance",
      legalDesc:
        "Guidance and advice for immigration and legal questions",
      features: {
        integration: ["Help with procedures", "Social orientation", "Personalized support"],
        cultural: ["Dance classes", "Cooking workshops", "Cultural transmission"],
        networking: ["Professional events", "Mentoring", "Business opportunities"],
        education: ["French classes", "Children’s culture", "Academic support"],
        support: ["Emergency aid", "Moral support", "Mutual aid network"],
        legal: ["Legal advice", "Immigration help", "Legal guidance"]
      }
    },
    gallery: {
      title: "Gallery",
      subtitle: "Our most beautiful moments in pictures",
      more: "See more",
      cardDesc: "A beautiful celebration of our community",
      categories: {
        all: "All",
        events: "Events",
        culture: "Culture",
        community: "Community",
        family: "Family",
        celebrations: "Celebrations",
        sport: "Sport",
        commerce: "Commerce"
      },
      items: {
        independence2023: { 
          title: "Independence Day 2023",
          image: "/img/happy.jpg"
        },
        cookingWorkshop: { 
          title: "Traditional Cooking Workshop",
          image: "/img/cuisine.webp"
        },
        danceNight: { 
          title: "Ivorian Dance Night",
          image: "/img/danse.png"
        },
        generalAssembly: { 
          title: "General Assembly",
          image: "/img/ag.png"
        },
        kidsFestival: { 
          title: "Children's Festival",
          image: "/img/enfants.png"
        },
        weddingCeremony: { 
          title: "Wedding Ceremony",
          image: "/img/weeding.png"
        },
        footballMatch: { 
          title: "Football Match",
          image: "/img/foot.png"
        },
        africanMarket: { 
          title: "African Market",
          image: "/img/marché.jpg"
        },
        barbecueAccueil: { 
          title: "Welcome BBQ for Newcomers",
          date: "August 30, 2024",
          location: "Queen Mary Park, Edmonton",
          participants: "90 people",
          image: "/img/1.jpg",
          photos: ["/img/1.jpg"]
        }
      }
    },
    contact: {
      title: "Contact Us",
      subtitle: "We are here to listen",
      address: "Edmonton, Alberta, Canada",
      // email FR conservé côté EN (souhaité)
      email: "bureaucice2022@gmail.com",
      phone: "+1 (780) 720-3996",
      sectionTitles: { info: "Contact Information", follow: "Follow us" },
      form: {
        name: "Full Name",
        email: "Email Address",
        subject: "Subject",
        message: "Your Message",
        send: "Send Message",
        titleBox: "Send us a message"
      }
    },
    admin: {
      title: "Administration",
      subtitle: "Website content management",
      login: "Login",
      password: "Password",
      loginButton: "Sign in",
      logout: "Logout",
      gallery: {
        title: "Gallery Management",
        addImage: "Add Image",
        addVideo: "Add Video",
        titleLabel: "Title",
        descriptionLabel: "Description",
        fileLabel: "File",
        uploadButton: "Upload",
        cancelButton: "Cancel",
        successMessage: "Image added successfully!",
        errorMessage: "Error adding image",
        maxSize: "Maximum size: 50MB",
        supportedFormats: "Supported formats: JPG, PNG, GIF, MP4, MOV"
      },
      events: {
        title: "Events Management",
        addEvent: "Add Event",
        editEvent: "Edit Event",
        deleteEvent: "Delete Event",
        eventTitle: "Event Title",
        eventDate: "Date",
        eventLocation: "Location",
        eventDescription: "Description",
        eventImage: "Image",
        saveButton: "Save",
        cancelButton: "Cancel",
        deleteConfirm: "Are you sure you want to delete this event?"
      }
    }
  }
};
