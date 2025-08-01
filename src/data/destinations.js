// src/data/destinations.js
const destinations = [
  {
    id: 1,
    name: "Singapore",
    description: "A vibrant city-state known for its modern skyline, lush gardens, and diverse culture",
    mainImage: "https://example.com/singapore-skyline.jpg",
    facts: [
      "Singapore is one of the smallest countries in the world",
      "It's known as the 'Garden City' due to its many parks and tree-lined streets",
      "The country consists of one main island and 63 smaller islands",
      "Singapore has four official languages: English, Malay, Mandarin, and Tamil",
      "It has one of the world's busiest ports and is a global financial hub"
    ],
    bestTimeToVisit: "February to April (dry season with comfortable temperatures)",
    currency: "Singapore Dollar (SGD)",
    mustVisitPlaces: [
      { id: 101, name: "Gardens by the Bay", category: "Parks & Nature", description: "Iconic nature park with futuristic Supertree Grove, Cloud Forest and Flower Dome conservatories", image: "https://example.com/gardens-bay.jpg", location: { lat: 1.2815, lng: 103.8636 }, tips: "Visit in the evening to catch the Garden Rhapsody light show.", entryFee: "Free for outdoor gardens, S$28 for conservatories", openingHours: "5 AM - 2 AM (Outdoor gardens), 9 AM - 9 PM (Conservatories)" },
      { id: 102, name: "Marina Bay Sands", category: "Landmarks", description: "Luxury hotel, casino, and observation deck with stunning views of Singapore", image: "https://example.com/marina-bay-sands.jpg", location: { lat: 1.2836, lng: 103.8602 }, tips: "The SkyPark observation deck offers panoramic views.", entryFee: "S$23 for SkyPark Observation Deck", openingHours: "11 AM - 9 PM (SkyPark)" },
      { id: 103, name: "Sentosa Island", category: "Beaches & Resorts", description: "Entertainment hub with Universal Studios, beaches, and adventure parks", image: "https://example.com/sentosa-island.jpg", location: { lat: 1.2494, lng: 103.8303 }, tips: "Take the cable car for the best scenic views.", entryFee: "Free entry, attractions priced separately", openingHours: "Varies by attraction" },
      { id: 104, name: "Chinatown", category: "Cultural & Heritage", description: "Historic district with temples, street markets, and authentic cuisine", image: "https://example.com/chinatown.jpg", location: { lat: 1.2833, lng: 103.8448 }, tips: "Visit at night for vibrant market scenes.", entryFee: "Free", openingHours: "Always open" },
      { id: 105, name: "Little India", category: "Cultural & Heritage", description: "Colorful neighborhood filled with Indian restaurants, temples, and markets", image: "https://example.com/little-india.jpg", location: { lat: 1.3066, lng: 103.8499 }, tips: "Try local Indian dishes and visit Sri Veeramakaliamman Temple.", entryFee: "Free", openingHours: "Always open" },
      { id: 106, name: "Clarke Quay", category: "Nightlife & Dining", description: "Riverside quay known for its nightlife, bars, and restaurants", image: "https://example.com/clarke-quay.jpg", location: { lat: 1.2906, lng: 103.8465 }, tips: "Best visited in the evening for the nightlife experience.", entryFee: "Free", openingHours: "Varies by venue" },
      { id: 107, name: "Singapore Zoo", category: "Wildlife & Nature", description: "World-renowned open-concept zoo featuring over 2,800 animals", image: "https://example.com/singapore-zoo.jpg", location: { lat: 1.4043, lng: 103.7930 }, tips: "Try the Night Safari for a unique experience.", entryFee: "S$39 for adults", openingHours: "8:30 AM - 6 PM" },
      { id: 108, name: "National Gallery Singapore", category: "Art & Culture", description: "Southeast Asia's largest modern art museum", image: "https://example.com/national-gallery.jpg", location: { lat: 1.2903, lng: 103.8514 }, tips: "Check for rotating exhibitions.", entryFee: "S$20 for adults", openingHours: "10 AM - 7 PM" },
      { id: 109, name: "Singapore Flyer", category: "Landmarks", description: "One of the world's largest observation wheels", image: "https://example.com/singapore-flyer.jpg", location: { lat: 1.2893, lng: 103.8631 }, tips: "Go at sunset for breathtaking views.", entryFee: "S$33 for adults", openingHours: "8:30 AM - 10:30 PM" },
      { id: 110, name: "Haji Lane", category: "Shopping & Culture", description: "Trendy street with indie boutiques, street art, and cafes", image: "https://example.com/haji-lane.jpg", location: { lat: 1.3009, lng: 103.8590 }, tips: "Perfect for shopping and Instagram-worthy photos.", entryFee: "Free", openingHours: "Varies by store" }
    ]
  },
  {
    "id": 2,
    "name": "Thailand",
    "description": "A Southeast Asian country known for its tropical beaches, opulent royal palaces, ancient ruins, and ornate temples.",
    "mainImage": "https://example.com/thailand-main.jpg",
    "facts": [
        "Thailand has never been colonized by a European power.",
        "It was known as Siam until 1939.",
        "Thailand is home to over 40,000 Buddhist temples.",
        "The Thai language has 44 consonants and 32 vowels.",
        "Thailand is often called the 'Land of Smiles'."
    ],
    "bestTimeToVisit": "November to April (dry season)",
    "currency": "Thai Baht (THB)",
    "mustVisitPlaces": [
        {
            "id": 201,
            "name": "Grand Palace",
            "category": "Historical Sites",
            "description": "Former residence of Thai kings and home to the Temple of the Emerald Buddha.",
            "image": "https://example.com/grand-palace.jpg",
            "location": { "lat": 13.7500, "lng": 100.4913 },
            "tips": "Strict dress code enforced. Cover shoulders and knees. Arrive early to avoid crowds.",
            "entryFee": "500 THB for foreigners",
            "openingHours": "8:30 AM - 3:30 PM daily"
        },
        {
            "id": 202,
            "name": "Phi Phi Islands",
            "category": "Natural Attractions",
            "description": "Stunning tropical islands with crystal clear waters, limestone cliffs, and white sand beaches.",
            "image": "https://example.com/phi-phi.jpg",
            "location": { "lat": 7.7407, "lng": 98.7784 },
            "tips": "Book island-hopping tours in advance. Best visited during dry season.",
            "entryFee": "400 THB National Park fee",
            "openingHours": "24/7"
        },
        {
            "id": 203,
            "name": "Wat Phra That Doi Suthep",
            "category": "Religious Sites",
            "description": "Sacred temple offering panoramic views of Chiang Mai from its mountain location.",
            "image": "https://example.com/doi-suthep.jpg",
            "location": { "lat": 18.8048, "lng": 98.9217 },
            "tips": "Take a songthaew (red truck) up the mountain. Visit early morning for best views.",
            "entryFee": "30 THB for foreigners",
            "openingHours": "6 AM - 6 PM"
        },
        {
            "id": 204,
            "name": "Ayutthaya Historical Park",
            "category": "Historical Sites",
            "description": "Ruins of the ancient capital of Siam, featuring impressive temples and Buddha statues.",
            "image": "https://example.com/ayutthaya.jpg",
            "location": { "lat": 14.3569, "lng": 100.5583 },
            "tips": "Rent a bicycle to explore the ruins. Bring plenty of water and sun protection.",
            "entryFee": "50 THB per temple",
            "openingHours": "7 AM - 6 PM"
        },
        {
            "id": 205,
            "name": "Khao Yai National Park",
            "category": "Natural Attractions",
            "description": "Thailand's oldest national park, featuring diverse wildlife, waterfalls, and hiking trails.",
            "image": "https://example.com/khao-yai.jpg",
            "location": { "lat": 14.4393, "lng": 101.3720 },
            "tips": "Book a guided tour to spot wildlife. Visit during dry season for best hiking conditions.",
            "entryFee": "400 THB for foreigners",
            "openingHours": "6 AM - 6 PM"
        },
        {
            "id": 206,
            "name": "Chatuchak Weekend Market",
            "category": "Shopping",
            "description": "One of the world's largest weekend markets with over 15,000 stalls.",
            "image": "https://example.com/chatuchak.jpg",
            "location": { "lat": 13.7999, "lng": 100.5502 },
            "tips": "Go early, bring water, and wear comfortable shoes. Bargaining is expected.",
            "entryFee": "Free",
            "openingHours": "6 AM - 6 PM (Saturdays and Sundays)"
        },
        {
            "id": 207,
            "name": "Sukhothai Historical Park",
            "category": "Historical Sites",
            "description": "UNESCO World Heritage site featuring ruins of the 13th-century capital.",
            "image": "https://example.com/sukhothai.jpg",
            "location": { "lat": 17.0169, "lng": 99.7026 },
            "tips": "Rent a bicycle to explore the park. Visit during sunrise or sunset for best photos.",
            "entryFee": "100 THB for foreigners",
            "openingHours": "6 AM - 6 PM"
        },
        {
            "id": 208,
            "name": "Railay Beach",
            "category": "Natural Attractions",
            "description": "Stunning peninsula accessible only by boat, famous for rock climbing and beaches.",
            "image": "https://example.com/railay.jpg",
            "location": { "lat": 8.0119, "lng": 98.8370 },
            "tips": "Stay overnight to experience the peaceful evening atmosphere.",
            "entryFee": "Free",
            "openingHours": "24/7"
        },
        {
            "id": 209,
            "name": "Wat Arun",
            "category": "Religious Sites",
            "description": "Iconic temple on the Chao Phraya River known for its striking spires.",
            "image": "https://example.com/wat-arun.jpg",
            "location": { "lat": 13.7437, "lng": 100.4888 },
            "tips": "Visit at sunset for spectacular views. Take a ferry from Wat Pho.",
            "entryFee": "100 THB for foreigners",
            "openingHours": "8 AM - 5:30 PM"
        },
        {
            "id": 210,
            "name": "Similan Islands",
            "category": "Natural Attractions",
            "description": "Archipelago known for world-class diving and snorkeling sites.",
            "image": "https://example.com/similan.jpg",
            "location": { "lat": 8.6500, "lng": 97.6500 },
            "tips": "Book diving trips in advance. Only open October to May.",
            "entryFee": "500 THB National Park fee",
            "openingHours": "Open October to May only"
        }
    ]
},
  {
    id: 3,
    name: "Paris",
    description: "The romantic capital of France, known for its art, culture, cuisine, and iconic landmarks.",
    mainImage: "https://example.com/paris-main.jpg",
    facts: [
      "The Eiffel Tower was originally meant to be a temporary structure.",
      "Paris has over 450 parks and gardens.",
      "The Louvre is the world's largest art museum.",
      "There are 37 bridges across the Seine River in Paris.",
      "Paris has 20 arrondissements (administrative districts) arranged in a spiral pattern."
    ],
    bestTimeToVisit: "June to August (summer) or September to October (fall).",
    currency: "Euro (EUR)",
    mustVisitPlaces: [
      {
        id: 301,
        name: "Eiffel Tower",
        category: "Landmarks",
        description: "Iconic iron lattice tower on the Champ de Mars, symbol of Paris and France.",
        image: "https://example.com/eiffel-tower.jpg",
        location: { lat: 48.8584, lng: 2.2945 },
        tips: "Book tickets online to avoid long queues. Visit at sunset for spectacular views.",
        entryFee: "€26.10 for adults (elevator to top)",
        openingHours: "9 AM - midnight (summer), 9:30 AM - 10:45 PM (winter)"
      },
      {
        id: 302,
        name: "Louvre Museum",
        category: "Museums",
        description: "World's largest art museum, home to thousands of works including the Mona Lisa.",
        image: "https://example.com/louvre.jpg",
        location: { lat: 48.8606, lng: 2.3376 },
        tips: "Get tickets in advance and arrive early. Plan your must-see artworks beforehand.",
        entryFee: "€17 for adults",
        openingHours: "9 AM - 6 PM (closed Tuesdays)"
      },
      {
        id: 303,
        name: "Notre-Dame Cathedral",
        category: "Religious Sites",
        description: "Medieval Catholic cathedral known for its French Gothic architecture.",
        image: "https://example.com/notre-dame.jpg",
        location: { lat: 48.8530, lng: 2.3499 },
        tips: "Currently under restoration. View the ongoing reconstruction from designated viewing areas.",
        entryFee: "Currently closed for restoration",
        openingHours: "Exterior viewing only"
      },
      {
        id: 304,
        name: "Arc de Triomphe",
        category: "Monuments",
        description: "Iconic triumphal arch honoring those who fought for France.",
        image: "https://example.com/arc-de-triomphe.jpg",
        location: { lat: 48.8738, lng: 2.2950 },
        tips: "Use the underground passage to reach the arch. Visit at sunset for city views.",
        entryFee: "€13 for adults",
        openingHours: "10 AM - 10:30 PM"
      },
      {
        id: 305,
        name: "Palace of Versailles",
        category: "Historical Sites",
        description: "Opulent royal château and gardens that symbolize the absolute monarchy of the Ancien Régime.",
        image: "https://example.com/versailles.jpg",
        location: { lat: 48.8048, lng: 2.1203 },
        tips: "Visit mid-week to avoid crowds. Allow a full day to explore the palace and gardens.",
        entryFee: "€18 for palace, €20 for passport (includes gardens)",
        openingHours: "9 AM - 5:30 PM (closed Mondays)"
      },
      {
        id: 306,
        name: "Musée d'Orsay",
        category: "Museums",
        description: "Museum housed in a former railway station, featuring impressionist art.",
        image: "https://example.com/orsay.jpg",
        location: { lat: 48.8600, lng: 2.3266 },
        tips: "Visit on Thursday evenings for extended hours and fewer crowds.",
        entryFee: "€16 for adults",
        openingHours: "9:30 AM - 6 PM (9:45 PM on Thursdays)"
      },
      {
        id: 307,
        name: "Sainte-Chapelle",
        category: "Religious Sites",
        description: "Gothic chapel famous for its spectacular stained glass windows.",
        image: "https://example.com/sainte-chapelle.jpg",
        location: { lat: 48.8554, lng: 2.3451 },
        tips: "Visit on a sunny day for the best experience with the stained glass.",
        entryFee: "€11.50 for adults",
        openingHours: "9 AM - 5 PM"
      },
      {
        id: 308,
        name: "Montmartre",
        category: "Neighborhoods",
        description: "Historic hilltop area known for its artists, Sacré-Cœur Basilica, and bohemian atmosphere.",
        image: "https://example.com/montmartre.jpg",
        location: { lat: 48.8867, lng: 2.3431 },
        tips: "Visit early morning to avoid crowds and get the best photos.",
        entryFee: "Free",
        openingHours: "24/7"
      },
      {
        id: 309,
        name: "Centre Pompidou",
        category: "Museums",
        description: "Modern and contemporary art museum with distinctive inside-out architecture.",
        image: "https://example.com/pompidou.jpg",
        location: { lat: 48.8607, lng: 2.3522 },
        tips: "The view from the top floor is one of Paris's best panoramas.",
        entryFee: "€14 for adults",
        openingHours: "11 AM - 9 PM (closed Tuesdays)"
      },
      {
        id: 310,
        name: "Luxembourg Gardens",
        category: "Parks & Gardens",
        description: "Beautiful palace gardens with fountains, statues, and peaceful atmosphere.",
        image: "https://example.com/luxembourg.jpg",
        location: { lat: 48.8462, lng: 2.3371 },
        tips: "Perfect for a picnic or afternoon relaxation.",
        entryFee: "Free",
        openingHours: "7:30 AM - sunset"
      }
    ]
  },
  {
    id: 4,
    name: "New Zealand",
    description: "A country of stunning natural beauty, from dramatic mountains to pristine beaches.",
    mainImage: "https://example.com/newzealand-main.jpg",
    facts: [
      "New Zealand has more sheep than people.",
      "It was the first country to give women the right to vote.",
      "The Lord of the Rings trilogy was filmed here.",
      "There are no native land mammals except for bats.",
      "It has the world's only alpine parrot, the Kea."
    ],
    bestTimeToVisit: "December to February (summer) or June to August (winter sports).",
    currency: "New Zealand Dollar (NZD)",
    mustVisitPlaces: [
      {
        id: 401,
        name: "Milford Sound",
        category: "Natural Wonders",
        description: "Stunning fiord in South Island with towering peaks and waterfalls.",
        image: "https://example.com/milford-sound.jpg",
        location: { lat: -44.6414, lng: 167.8974 },
        tips: "Take a cruise to see seals and dolphins. Morning cruises usually have the best weather.",
        entryFee: "Various cruise prices from NZD 80",
        openingHours: "Cruises operate daily"
      },
      {
        id: 402,
        name: "Hobbiton Movie Set",
        category: "Entertainment",
        description: "Original filming location for The Hobbit and The Lord of the Rings trilogies.",
        image: "https://example.com/hobbiton.jpg",
        location: { lat: -37.8721, lng: 175.6832 },
        tips: "Book guided tours in advance. Visit early morning for best photos.",
        entryFee: "NZD 89 for adults",
        openingHours: "9 AM - 5 PM"
      },
      {
        id: 403,
        name: "Rotorua",
        category: "Geothermal",
        description: "Geothermal wonderland with hot springs, geysers, and Maori culture.",
        image: "https://example.com/rotorua.jpg",
        location: { lat: -38.1368, lng: 176.2497 },
        tips: "Don't miss the traditional Maori cultural shows and hangi feast.",
        entryFee: "Varies by attraction",
        openingHours: "24/7 for natural features"
      },
      {
        id: 404,
        name: "Franz Josef Glacier",
        category: "Natural Wonders",
        description: "One of the most accessible glaciers in the world.",
        image: "https://example.com/franz-josef.jpg",
        location: { lat: -43.4000, lng: 170.1833 },
        tips: "Take a guided ice walk or helicopter tour for the best experience.",
        entryFee: "From NZD 99 for guided tours",
        openingHours: "Guided tours operate daily"
      },
      {
        id: 405,
        name: "Bay of Islands",
        category: "Coastal",
        description: "Beautiful bay area with 144 islands, perfect for sailing and wildlife watching.",
        image: "https://example.com/bay-of-islands.jpg",
        location: { lat: -35.2285, lng: 174.1416 },
        tips: "Take a dolphin-watching cruise or visit the historic Waitangi Treaty Grounds.",
        entryFee: "Various tour prices",
        openingHours: "24/7"
      },
      {
        id: 406,
        name: "Tongariro National Park",
        category: "National Parks",
        description: "Dual World Heritage site with dramatic volcanoes and alpine landscapes.",
        image: "https://example.com/tongariro.jpg",
        location: { lat: -39.2900, lng: 175.5621 },
        tips: "The Tongariro Alpine Crossing is considered one of the world's best day hikes.",
        entryFee: "Free entry, guided tours extra",
        openingHours: "24/7"
      },
      {
        id: 407,
        name: "Abel Tasman National Park",
        category: "National Parks",
        description: "Coastal paradise with golden beaches and turquoise waters.",
        image: "https://example.com/abel-tasman.jpg",
        location: { lat: -40.9147, lng: 172.9610 },
        tips: "Kayaking and hiking are popular activities. Book water taxis in advance.",
        entryFee: "Free entry, activities extra",
        openingHours: "24/7"
      },
      {
        id: 408,
        name: "Queenstown",
        category: "Adventure Sports",
        description: "Adventure capital of the world with skiing, bungee jumping, and more.",
        image: "https://example.com/queenstown.jpg",
        location: { lat: -45.0312, lng: 168.6626 },
        tips: "Book adventure activities in advance during peak season.",
        entryFee: "Varies by activity",
        openingHours: "Various by activity"
      },
      {
        id: 409,
        name: "Wellington Cable Car",
        category: "Urban Attractions",
        description: "Historic cable car offering panoramic views of the capital city.",
        image: "https://example.com/wellington-cable-car.jpg",
        location: { lat: -41.2865, lng: 174.7762 },
        tips: "Visit the Cable Car Museum at the top station.",
        entryFee: "NZD 9 return trip",
        openingHours: "7 AM - 10 PM"
      },
      {
        id: 410,
        name: "Waitomo Glowworm Caves",
        category: "Natural Wonders",
        description: "Famous caves illuminated by thousands of glowworms.",
        image: "https://example.com/waitomo.jpg",
        location: { lat: -38.2622, lng: 175.1022 },
        tips: "Book the black water rafting tour for an adventurous experience.",
        entryFee: "NZD 55 for basic tour",
        openingHours: "9 AM - 5 PM"
      }
    ]
  },
  {
    id: 5,
    name: "Bora Bora",
    description: "A tropical paradise in French Polynesia known for its crystal-clear lagoon, overwater bungalows, and luxury resorts.",
    mainImage: "https://example.com/borabora-main.jpg",
    facts: [
      "Bora Bora was discovered by James Cook in 1769.",
      "The island's lagoon is a protected nursery for blacktip reef sharks.",
      "The local Tahitian name for Bora Bora is Pora Pora, meaning 'first born'.",
      "The island was used as a military supply base during World War II.",
      "There are no poisonous snakes or insects on Bora Bora."
    ],
    bestTimeToVisit: "May to October (dry season with lower humidity).",
    currency: "French Pacific Franc (XPF)",
    mustVisitPlaces: [
      {
        id: 501,
        name: "Mount Otemanu",
        category: "Natural Landmarks",
        description: "Ancient volcanic peak rising 727 meters above the lagoon.",
        image: "https://example.com/otemanu.jpg",
        location: { lat: -16.5004, lng: -151.7415 },
        tips: "Take a 4x4 tour to the base or hire a guide for hiking. Best photos at sunset.",
        entryFee: "Varies by tour operator",
        openingHours: "24/7"
      },
      {
        id: 502,
        name: "Matira Beach",
        category: "Beaches",
        description: "Public white sand beach with calm waters and stunning sunset views.",
        image: "https://example.com/matira.jpg",
        location: { lat: -16.5405, lng: -151.7517 },
        tips: "Visit early morning for the best snorkeling conditions.",
        entryFee: "Free",
        openingHours: "24/7"
      },
      {
        id: 503,
        name: "Lagoonarium",
        category: "Nature & Wildlife",
        description: "Natural aquarium where you can swim with sharks and rays.",
        image: "https://example.com/lagoonarium.jpg",
        location: { lat: -16.5171, lng: -151.7361 },
        tips: "Book a guided tour for the best experience with marine life.",
        entryFee: "8000 XPF per person",
        openingHours: "8 AM - 4 PM"
      },
      {
        id: 504,
        name: "Coral Gardens",
        category: "Snorkeling",
        description: "Premier snorkeling spot with diverse coral and marine life.",
        image: "https://example.com/coral-gardens.jpg",
        location: { lat: -16.5238, lng: -151.7528 },
        tips: "Bring underwater camera and reef-safe sunscreen.",
        entryFee: "Free for independent access, tour prices vary",
        openingHours: "Best during daylight hours"
      },
      {
        id: 505,
        name: "Bloody Mary's Restaurant",
        category: "Dining",
        description: "Famous restaurant known for fresh seafood and celebrity visits.",
        image: "https://example.com/bloody-marys.jpg",
        location: { lat: -16.5173, lng: -151.7422 },
        tips: "Make reservations in advance. Try the catch of the day.",
        entryFee: "Meal prices vary",
        openingHours: "11 AM - 9:30 PM (closed Sundays)"
      },
      {
        id: 506,
        name: "Vaitape",
        category: "Towns",
        description: "Main village and commercial center of Bora Bora.",
        image: "https://example.com/vaitape.jpg",
        location: { lat: -16.5167, lng: -151.7500 },
        tips: "Visit the local markets for black pearls and handicrafts.",
        entryFee: "Free",
        openingHours: "Shops typically 8 AM - 5 PM"
      },
      {
        id: 507,
        name: "Tupitipiti Point",
        category: "Viewpoints",
        description: "Scenic lookout offering panoramic views of the lagoon.",
        image: "https://example.com/tupitipiti.jpg",
        location: { lat: -16.5082, lng: -151.7361 },
        tips: "Best for sunrise photography. Bring sturdy shoes for the walk.",
        entryFee: "Free",
        openingHours: "24/7"
      },
      {
        id: 508,
        name: "Leopard Ray Trench",
        category: "Nature & Wildlife",
        description: "Natural habitat where you can observe leopard rays.",
        image: "https://example.com/ray-trench.jpg",
        location: { lat: -16.5334, lng: -151.7289 },
        tips: "Visit during high tide for best ray sightings.",
        entryFee: "Tour prices vary",
        openingHours: "Dawn to dusk"
      },
      {
        id: 509,
        name: "Point Matira",
        category: "Activities",
        description: "Popular spot for water sports and parasailing.",
        image: "https://example.com/point-matira.jpg",
        location: { lat: -16.5423, lng: -151.7517 },
        tips: "Book water activities early in the day when winds are calmer.",
        entryFee: "Activity prices vary",
        openingHours: "8 AM - 5 PM"
      },
      {
        id: 510,
        name: "World War II Cannons",
        category: "Historical Sites",
        description: "Historical US military installations from WWII.",
        image: "https://example.com/wwii-cannons.jpg",
        location: { lat: -16.5156, lng: -151.7422 },
        tips: "Hire a guide for historical context. Rough terrain requires good shoes.",
        entryFee: "Free",
        openingHours: "24/7"
      }
    ]
  },
  {
    id: 6,
    name: "Denmark",
    description: "A Scandinavian country known for its design, cycling culture, hygge lifestyle, and historic cities.",
    mainImage: "https://example.com/denmark-main.jpg",
    facts: [
      "Denmark is consistently ranked among the happiest countries in the world.",
      "The Danish monarchy is the oldest continuing monarchy in the world.",
      "Danes have the concept of 'hygge', representing coziness and comfortable conviviality.",
      "Copenhagen is considered one of the most bicycle-friendly cities globally.",
      "LEGO was invented in Denmark in 1932."
    ],
    bestTimeToVisit: "May to August (warm weather and long daylight hours).",
    currency: "Danish Krone (DKK)",
    mustVisitPlaces: [
      {
        id: 601,
        name: "Tivoli Gardens",
        category: "Entertainment",
        description: "Historic amusement park and pleasure garden in Copenhagen.",
        image: "https://example.com/tivoli.jpg",
        location: { lat: 55.6735, lng: 12.5681 },
        tips: "Visit after dark to see the magical illuminations. Buy combination tickets for best value.",
        entryFee: "135 DKK for admission only",
        openingHours: "11 AM - 10 PM (later in summer)"
      },
      {
        id: 602,
        name: "Nyhavn",
        category: "Historic District",
        description: "17th-century waterfront district with colorful buildings and restaurants.",
        image: "https://example.com/nyhavn.jpg",
        location: { lat: 55.6797, lng: 12.5882 },
        tips: "Visit early morning for photos without crowds. House No. 20 was Hans Christian Andersen's home.",
        entryFee: "Free",
        openingHours: "24/7"
      },
      {
        id: 603,
        name: "Kronborg Castle",
        category: "Historical Sites",
        description: "UNESCO World Heritage site and setting of Shakespeare's Hamlet.",
        image: "https://example.com/kronborg.jpg",
        location: { lat: 56.0387, lng: 12.6211 },
        tips: "Take guided tour to access the casemates. Check schedule for Shakespeare performances.",
        entryFee: "145 DKK for adults",
        openingHours: "10 AM - 5 PM (May-September)"
      },
      {
        id: 604,
        name: "The Little Mermaid",
        category: "Landmarks",
        description: "Iconic bronze statue based on Hans Christian Andersen's fairy tale.",
        image: "https://example.com/mermaid.jpg",
        location: { lat: 55.6927, lng: 12.5991 },
        tips: "Visit early morning or evening to avoid crowds. Combine with Kastellet visit.",
        entryFee: "Free",
        openingHours: "24/7"
      },
      {
        id: 605,
        name: "Rosenborg Castle",
        category: "Museums",
        description: "Renaissance castle housing Danish Crown Jewels.",
        image: "https://example.com/rosenborg.jpg",
        location: { lat: 55.6858, lng: 12.5770 },
        tips: "Don't miss the Knight's Hall and Crown Jewels in the treasury.",
        entryFee: "120 DKK for adults",
        openingHours: "10 AM - 4 PM"
      },
      {
        id: 606,
        name: "LEGOLAND Billund",
        category: "Theme Parks",
        description: "Original LEGOLAND park with miniature cities and attractions.",
        image: "https://example.com/legoland.jpg",
        location: { lat: 55.7353, lng: 9.1280 },
        tips: "Book tickets online for discounts. Visit during shoulder season to avoid crowds.",
        entryFee: "399 DKK for adults",
        openingHours: "10 AM - 6 PM (seasonal variations)"
      },
      {
        id: 607,
        name: "Amalienborg Palace",
        category: "Royal Residences",
        description: "Winter home of the Danish Royal Family comprising four identical palaces.",
        image: "https://example.com/amalienborg.jpg",
        location: { lat: 55.6841, lng: 12.5932 },
        tips: "Watch the changing of the Royal Guard at noon. Visit the museum in Christian VIII's Palace.",
        entryFee: "95 DKK for museum",
        openingHours: "10 AM - 5 PM"
      },
      {
        id: 608,
        name: "ARoS Art Museum",
        category: "Museums",
        description: "Modern art museum famous for its rainbow panorama walkway.",
        image: "https://example.com/aros.jpg",
        location: { lat: 56.1537, lng: 10.1997 },
        tips: "Visit the Rainbow Panorama at sunset. Allow at least 3 hours for full visit.",
        entryFee: "140 DKK for adults",
        openingHours: "10 AM - 5 PM (Wednesday until 10 PM)"
      },
      {
        id: 609,
        name: "Christiansborg Palace",
        category: "Government Buildings",
        description: "Seat of Danish Parliament, Supreme Court, and Prime Minister's Office.",
        image: "https://example.com/christiansborg.jpg",
        location: { lat: 55.6762, lng: 12.5792 },
        tips: "Take tower tour for free city views. Visit royal reception rooms when parliament not in session.",
        entryFee: "150 DKK for combined ticket",
        openingHours: "10 AM - 5 PM"
      },
      {
        id: 610,
        name: "Frederiksberg Gardens",
        category: "Parks",
        description: "Romantic English-style landscape garden with palace views.",
        image: "https://example.com/frederiksberg.jpg",
        location: { lat: 55.6728, lng: 12.5241 },
        tips: "Bring picnic supplies. Watch elephants in adjacent zoo from elephant hill.",
        entryFee: "Free",
        openingHours: "Dawn to dusk"
      }
    ]
  },{
    id: 7,
    name: "Australia",
    description: "A vast country known for its unique wildlife, stunning beaches, outback landscapes, and vibrant cities.",
    mainImage: "https://example.com/australia-main.jpg",
    facts: [
      "Australia is home to 21 of the world's 25 most venomous snakes.",
      "The Great Barrier Reef is the world's largest living structure.",
      "Kangaroos and emus can't walk backwards.",
      "Australia has over 10,000 beaches, you could visit a new beach every day for over 27 years.",
      "The Australian Alps get more snow than the Swiss Alps."
    ],
    bestTimeToVisit: "September to November (spring) or March to May (autumn).",
    currency: "Australian Dollar (AUD)",
    mustVisitPlaces: [
      {
        id: 701,
        name: "Great Barrier Reef",
        category: "Natural Wonders",
        description: "World's largest coral reef system, home to diverse marine life.",
        image: "https://example.com/great-barrier-reef.jpg",
        location: { lat: -18.2871, lng: 147.6992 },
        tips: "Book eco-certified tours. Best visibility from June to October.",
        entryFee: "Various tour prices from AUD 200",
        openingHours: "Varies by tour operator"
      },
      {
        id: 702,
        name: "Sydney Opera House",
        category: "Architecture",
        description: "UNESCO World Heritage site and iconic performing arts venue.",
        image: "https://example.com/opera-house.jpg",
        location: { lat: -33.8568, lng: 151.2153 },
        tips: "Take a guided tour or attend a performance. Book tours in advance.",
        entryFee: "AUD 43 for guided tour",
        openingHours: "9 AM - 5 PM (tours)"
      },
      {
        id: 703,
        name: "Uluru",
        category: "Natural Landmarks",
        description: "Sacred Aboriginal site and massive sandstone monolith in the outback.",
        image: "https://example.com/uluru.jpg",
        location: { lat: -25.3444, lng: 131.0369 },
        tips: "Visit at sunrise or sunset. Respect Aboriginal cultural restrictions.",
        entryFee: "AUD 38 (3-day park pass)",
        openingHours: "24/7"
      },
      {
        id: 704,
        name: "Bondi Beach",
        category: "Beaches",
        description: "Famous Sydney beach known for surfing and coastal walks.",
        image: "https://example.com/bondi.jpg",
        location: { lat: -33.8915, lng: 151.2767 },
        tips: "Try the Bondi to Bronte coastal walk. Visit Bondi Icebergs for iconic photos.",
        entryFee: "Free",
        openingHours: "24/7"
      },
      {
        id: 705,
        name: "Great Ocean Road",
        category: "Scenic Drives",
        description: "243-kilometer stretch of road featuring dramatic coastline and the Twelve Apostles.",
        image: "https://example.com/great-ocean-road.jpg",
        location: { lat: -38.6674, lng: 143.1047 },
        tips: "Allow at least 2-3 days for the full experience. Stop at lookouts early morning for best photos.",
        entryFee: "Free (vehicle costs separate)",
        openingHours: "24/7"
      },
      {
        id: 706,
        name: "Daintree Rainforest",
        category: "Natural Wonders",
        description: "World's oldest rainforest, featuring unique wildlife and Aboriginal cultural sites.",
        image: "https://example.com/daintree.jpg",
        location: { lat: -16.1700, lng: 145.4000 },
        tips: "Take a guided Aboriginal cultural tour. Visit during dry season (May-September).",
        entryFee: "AUD 39 for vehicle ferry",
        openingHours: "24/7"
      },
      {
        id: 707,
        name: "Melbourne Cricket Ground",
        category: "Sports",
        description: "Iconic sports stadium hosting cricket, AFL, and major events.",
        image: "https://example.com/mcg.jpg",
        location: { lat: -37.8200, lng: 144.9833 },
        tips: "Take a behind-the-scenes tour. Visit the National Sports Museum.",
        entryFee: "AUD 25 for tours",
        openingHours: "10 AM - 3 PM (tours)"
      },
      {
        id: 708,
        name: "Kangaroo Island",
        category: "Wildlife",
        description: "Natural sanctuary for native Australian wildlife and stunning landscapes.",
        image: "https://example.com/kangaroo-island.jpg",
        location: { lat: -35.8177, lng: 137.2084 },
        tips: "Stay at least 2 days. Visit Seal Bay and Remarkable Rocks.",
        entryFee: "Various tour prices from AUD 150",
        openingHours: "24/7"
      },
      {
        id: 709,
        name: "Blue Mountains",
        category: "Natural Wonders",
        description: "Mountain range known for dramatic scenery, waterfalls, and hiking trails.",
        image: "https://example.com/blue-mountains.jpg",
        location: { lat: -33.7200, lng: 150.3000 },
        tips: "Take the Scenic World railway. Visit Three Sisters at sunset.",
        entryFee: "Free (attractions separate)",
        openingHours: "24/7"
      },
      {
        id: 710,
        name: "Whitsunday Islands",
        category: "Islands",
        description: "74 tropical islands near the Great Barrier Reef with pristine beaches.",
        image: "https://example.com/whitsundays.jpg",
        location: { lat: -20.2870, lng: 148.9379 },
        tips: "Visit Whitehaven Beach. Book sailing trips in advance.",
        entryFee: "Various tour prices",
        openingHours: "24/7"
      }
    ]
  },
  {
    id: 8,
    name: "Maldives",
    description: "An archipelago of 26 natural atolls featuring pristine beaches, coral reefs, and luxury resorts.",
    mainImage: "https://example.com/maldives-main.jpg",
    facts: [
      "The Maldives is the world's lowest country, averaging 1.3 meters above sea level.",
      "It consists of over 1,000 coral islands.",
      "The islands are built on ancient coral reefs that grew around the sides of prehistoric volcanoes.",
      "Each resort in the Maldives is on its own private island.",
      "The country's beaches glow in the dark due to bioluminescent phytoplankton."
    ],
    bestTimeToVisit: "November to April (dry season with perfect weather).",
    currency: "Maldivian Rufiyaa (MVR)",
    mustVisitPlaces: [
      {
        id: 801,
        name: "Male",
        category: "Cities",
        description: "The capital city offering cultural insights and local life.",
        image: "https://example.com/male.jpg",
        location: { lat: 4.1755, lng: 73.5093 },
        tips: "Visit the local fish market early morning. Try local 'hedhikaa' (snacks).",
        entryFee: "Free",
        openingHours: "24/7"
      },
      {
        id: 802,
        name: "Maafushi",
        category: "Islands",
        description: "Popular local island for budget travelers with public beaches.",
        image: "https://example.com/maafushi.jpg",
        location: { lat: 3.9432, lng: 73.4903 },
        tips: "Book water sports activities through guesthouses. Respect local customs.",
        entryFee: "Free",
        openingHours: "24/7"
      },
      {
        id: 803,
        name: "HP Reef",
        category: "Diving",
        description: "Protected marine area known for diverse marine life and coral formations.",
        image: "https://example.com/hp-reef.jpg",
        location: { lat: 4.1167, lng: 73.5167 },
        tips: "Best for experienced divers. Book with certified dive centers.",
        entryFee: "USD 50-100 for diving trips",
        openingHours: "Dependent on weather and tides"
      },
      {
        id: 804,
        name: "Hulhumale",
        category: "Modern Islands",
        description: "Artificial island showcasing modern Maldivian urban development.",
        image: "https://example.com/hulhumale.jpg",
        location: { lat: 4.2167, lng: 73.5333 },
        tips: "Visit the beach at sunset. Try local restaurants.",
        entryFee: "Free",
        openingHours: "24/7"
      },
      {
        id: 805,
        name: "Alimatha Island",
        category: "Water Sports",
        description: "Famous for night diving with nurse sharks and water sports.",
        image: "https://example.com/alimatha.jpg",
        location: { lat: 3.5833, lng: 72.9167 },
        tips: "Book night diving in advance. Watch for marine life from the pier.",
        entryFee: "Resort rates vary",
        openingHours: "24/7 for resort guests"
      },
      {
        id: 806,
        name: "National Museum",
        category: "Culture",
        description: "Collection of historical artifacts from Maldivian history.",
        image: "https://example.com/national-museum.jpg",
        location: { lat: 4.1774, lng: 73.5125 },
        tips: "Visit early to avoid crowds. Look for ancient Buddhist artifacts.",
        entryFee: "MVR 100",
        openingHours: "10 AM - 4 PM (closed Fridays)"
      },
      {
        id: 807,
        name: "Artificial Beach",
        category: "Beaches",
        description: "Popular public beach in Male with water sports facilities.",
        image: "https://example.com/artificial-beach.jpg",
        location: { lat: 4.1744, lng: 73.5278 },
        tips: "Good for swimming and people watching. Popular with locals.",
        entryFee: "Free",
        openingHours: "24/7"
      },
      {
        id: 808,
        name: "Grand Friday Mosque",
        category: "Religious Sites",
        description: "Largest mosque in the Maldives with striking architecture.",
        image: "https://example.com/friday-mosque.jpg",
        location: { lat: 4.1775, lng: 73.5132 },
        tips: "Dress modestly. Visit outside prayer times.",
        entryFee: "Free",
        openingHours: "9 AM - 5 PM (except during prayers)"
      },
      {
        id: 809,
        name: "Thulusdhoo Island",
        category: "Surfing",
        description: "Famous for 'Cokes' and 'Chickens' surf breaks.",
        image: "https://example.com/thulusdhoo.jpg",
        location: { lat: 4.3731, lng: 73.6503 },
        tips: "Best surfing from May to October. Stay in local guesthouses.",
        entryFee: "Free",
        openingHours: "24/7"
      },
      {
        id: 810,
        name: "Whale Submarine",
        category: "Activities",
        description: "Tourist submarine offering underwater views without getting wet.",
        image: "https://example.com/whale-submarine.jpg",
        location: { lat: 4.1755, lng: 73.5093 },
        tips: "Book in advance. Best visibility during morning trips.",
        entryFee: "USD 150 per person",
        openingHours: "9 AM - 5 PM"
      }
    ]
  },
  {
    id: 9,
    name: "Taj Mahal",
    description: "An ivory-white marble mausoleum on the right bank of the river Yamuna, a UNESCO World Heritage site and symbol of eternal love.",
    mainImage: "https://example.com/tajmahal-main.jpg",
    facts: [
      "The Taj Mahal took 22 years to complete (1632-1653).",
      "It changes color throughout the day, from pinkish in the morning to white at noon to golden in the moonlight.",
      "Over 20,000 workers and 1,000 elephants were used in its construction.",
      "The four minarets are slightly tilted outwards to prevent damage to the main structure if they fall.",
      "The Arabic calligraphy on the marble was created using jasper or black stone inlays."
    ],
    bestTimeToVisit: "October to March (cool, dry season with clear skies).",
    currency: "Indian Rupee (INR)",
    mustVisitPlaces: [
      {
        id: 901,
        name: "Main Mausoleum",
        category: "Architecture",
        description: "The central structure with its iconic dome and intricate marble work.",
        image: "https://example.com/taj-main.jpg",
        location: { lat: 27.1751, lng: 78.0421 },
        tips: "Visit at sunrise for the best photos and fewer crowds. Book fast-track tickets online.",
        entryFee: "INR 1100 for foreigners",
        openingHours: "Sunrise to sunset (closed Fridays)"
      },
      {
        id: 902,
        name: "Mehtab Bagh",
        category: "Gardens",
        description: "Garden complex offering stunning views of the Taj Mahal across the river.",
        image: "https://example.com/mehtab-bagh.jpg",
        location: { lat: 27.1785, lng: 78.0413 },
        tips: "Perfect for sunset views. Best photo opportunities of the Taj.",
        entryFee: "INR 200 for foreigners",
        openingHours: "Sunrise to sunset"
      },
      {
        id: 903,
        name: "Mumtaz Mahal Tomb",
        category: "Historical",
        description: "The actual resting place of Mumtaz Mahal, centerpiece of the complex.",
        image: "https://example.com/mumtaz-tomb.jpg",
        location: { lat: 27.1751, lng: 78.0421 },
        tips: "Maintain silence inside. No photography allowed in the inner chamber.",
        entryFee: "Included in main ticket",
        openingHours: "Same as main complex"
      },
      {
        id: 904,
        name: "Taj Museum",
        category: "Museums",
        description: "Collection of Mughal artifacts, paintings, and construction materials.",
        image: "https://example.com/taj-museum.jpg",
        location: { lat: 27.1751, lng: 78.0421 },
        tips: "Visit before exploring the main complex. Contains original construction plans.",
        entryFee: "Included in main ticket",
        openingHours: "9 AM - 5 PM (closed Fridays)"
      },
      {
        id: 905,
        name: "Great Gate",
        category: "Architecture",
        description: "Main gateway to the Taj Mahal complex with intricate Arabic calligraphy.",
        image: "https://example.com/great-gate.jpg",
        location: { lat: 27.1747, lng: 78.0420 },
        tips: "Notice the optical illusion of the gate framing the Taj. Read the inscriptions.",
        entryFee: "Included in main ticket",
        openingHours: "Same as main complex"
      },
      {
        id: 906,
        name: "Mosque",
        category: "Religious Sites",
        description: "Red sandstone mosque on the western side of the Taj Mahal.",
        image: "https://example.com/taj-mosque.jpg",
        location: { lat: 27.1751, lng: 78.0419 },
        tips: "Remove shoes before entering. Visit early morning for best lighting.",
        entryFee: "Included in main ticket",
        openingHours: "Same as main complex"
      },
      {
        id: 907,
        name: "Jawab",
        category: "Architecture",
        description: "Mirror building to the mosque, maintaining symmetry of the complex.",
        image: "https://example.com/jawab.jpg",
        location: { lat: 27.1751, lng: 78.0423 },
        tips: "Compare architectural details with the mosque. Notice the subtle differences.",
        entryFee: "Included in main ticket",
        openingHours: "Same as main complex"
      },
      {
        id: 908,
        name: "Charbagh Gardens",
        category: "Gardens",
        description: "Symmetrical Mughal gardens with fountains and pathways.",
        image: "https://example.com/charbagh.jpg",
        location: { lat: 27.1749, lng: 78.0421 },
        tips: "Walk all four quarters to appreciate the symmetry. Best photos from central platform.",
        entryFee: "Included in main ticket",
        openingHours: "Same as main complex"
      },
      {
        id: 909,
        name: "Yamuna River View",
        category: "Natural Sites",
        description: "River viewpoint offering different perspectives of the complex.",
        image: "https://example.com/yamuna-view.jpg",
        location: { lat: 27.1753, lng: 78.0424 },
        tips: "Visit during monsoon when river is full. Good spot for bird watching.",
        entryFee: "Free from public areas",
        openingHours: "24/7"
      },
      {
        id: 910,
        name: "Naubat Khana",
        category: "Historical",
        description: "Ancient music gallery where musicians performed during Mughal era.",
        image: "https://example.com/naubat-khana.jpg",
        location: { lat: 27.1746, lng: 78.0420 },
        tips: "Learn about Mughal musical traditions. Notice the acoustic design.",
        entryFee: "Included in main ticket",
        openingHours: "Same as main complex"
      }
    ]
  },
  {
    id: 10,
    name: "Dubai",
    description: "A modern metropolis in the UAE known for luxury shopping, ultramodern architecture, and vibrant nightlife.",
    mainImage: "https://example.com/dubai-main.jpg",
    facts: [
      "Dubai has the world's tallest building, the Burj Khalifa.",
      "25% of the world's cranes are operating in Dubai.",
      "Dubai Police uses supercars like Bugatti Veyron and Ferrari FF.",
      "The Dubai Mall is the world's largest shopping center by total area.",
      "The Palm Jumeirah is visible from space."
    ],
    bestTimeToVisit: "November to March (pleasant temperatures and minimal rainfall).",
    currency: "United Arab Emirates Dirham (AED)",
    mustVisitPlaces: [
      {
        id: 1001,
        name: "Burj Khalifa",
        category: "Architecture",
        description: "World's tallest building with observation decks and luxury amenities.",
        image: "https://example.com/burj-khalifa.jpg",
        location: { lat: 25.1972, lng: 55.2744 },
        tips: "Book sunset slots in advance. Visit Level 148 for premium experience.",
        entryFee: "AED 149-379 depending on level and time",
        openingHours: "9 AM - 11 PM"
      },
      {
        id: 1002,
        name: "Palm Jumeirah",
        category: "Man-made Islands",
        description: "Palm-shaped artificial archipelago with luxury hotels and residences.",
        image: "https://example.com/palm-jumeirah.jpg",
        location: { lat: 25.1124, lng: 55.1390 },
        tips: "Take the Palm Monorail for views. Visit Atlantis Aquaventure Waterpark.",
        entryFee: "Free (attractions separately priced)",
        openingHours: "24/7"
      },
      {
        id: 1003,
        name: "Dubai Mall",
        category: "Shopping",
        description: "World's largest mall with shopping, entertainment, and attractions.",
        image: "https://example.com/dubai-mall.jpg",
        location: { lat: 25.1972, lng: 55.2798 },
        tips: "Allow full day to explore. Watch Dubai Fountain shows in evening.",
        entryFee: "Free entry",
        openingHours: "10 AM - 12 AM"
      },
      {
        id: 1004,
        name: "Dubai Desert Safari",
        category: "Adventure",
        description: "Desert experience with dune bashing, camel rides, and entertainment.",
        image: "https://example.com/desert-safari.jpg",
        location: { lat: 25.0000, lng: 55.5500 },
        tips: "Book evening safari for cooler temperatures. Wear comfortable clothes.",
        entryFee: "AED 250-500 per person",
        openingHours: "Various departure times"
      },
      {
        id: 1005,
        name: "Dubai Marina",
        category: "Waterfront",
        description: "Artificial canal city with luxury yachts and waterfront dining.",
        image: "https://example.com/dubai-marina.jpg",
        location: { lat: 25.0817, lng: 55.1439 },
        tips: "Take a dinner cruise. Walk the Marina Walk at sunset.",
        entryFee: "Free",
        openingHours: "24/7"
      },
      {
        id: 1006,
        name: "Gold Souk",
        category: "Markets",
        description: "Traditional market featuring gold jewelry and precious stones.",
        image: "https://example.com/gold-souk.jpg",
        location: { lat: 25.2867, lng: 55.2970 },
        tips: "Bargain for better prices. Check gold purity certification.",
        entryFee: "Free",
        openingHours: "10 AM - 10 PM"
      },
      {
        id: 1007,
        name: "Miracle Garden",
        category: "Gardens",
        description: "World's largest natural flower garden with floral installations.",
        image: "https://example.com/miracle-garden.jpg",
        location: { lat: 25.0559, lng: 55.2348 },
        tips: "Visit during winter months. Go early morning for best photos.",
        entryFee: "AED 55",
        openingHours: "9 AM - 9 PM (seasonal opening)"
      },
      {
        id: 1008,
        name: "Burj Al Arab",
        category: "Hotels",
        description: "Iconic sail-shaped hotel known for its luxury and service.",
        image: "https://example.com/burj-al-arab.jpg",
        location: { lat: 25.1412, lng: 55.1853 },
        tips: "Book afternoon tea experience. Visit Jumeirah beach for photos.",
        entryFee: "Entry with reservation only",
        openingHours: "24/7 for guests"
      },
      {
        id: 1009,
        name: "Dubai Frame",
        category: "Attractions",
        description: "Architectural landmark offering views of old and new Dubai.",
        image: "https://example.com/dubai-frame.jpg",
        location: { lat: 25.2344, lng: 55.3001 },
        tips: "Visit during golden hour. Walk on glass floor bridge.",
        entryFee: "AED 50",
        openingHours: "9 AM - 9 PM"
      },
      {
        id: 1010,
        name: "Museum of the Future",
        category: "Museums",
        description: "Innovative museum exploring future technology and development.",
        image: "https://example.com/future-museum.jpg",
        location: { lat: 25.2248, lng: 55.2867 },
        tips: "Book tickets online in advance. Plan for 2-3 hours visit.",
        entryFee: "AED 145",
        openingHours: "10 AM - 6 PM"
      }
    ]
  },
  {
    id: 11,
    name: "Pyramids of Giza",
    description: "Ancient Egyptian necropolis featuring the Great Pyramid, one of the Seven Wonders of the Ancient World.",
    mainImage: "https://example.com/pyramids-main.jpg",
    facts: [
      "The Great Pyramid was the tallest man-made structure for over 3,800 years.",
      "Each stone block weighs an average of 2.5 tons.",
      "The pyramids are perfectly aligned with the points of the compass.",
      "No mummy was ever found in the Great Pyramid.",
      "The complex contains three main pyramids: Khufu, Khafre, and Menkaure."
    ],
    bestTimeToVisit: "October to April (cooler temperatures and clear skies).",
    currency: "Egyptian Pound (EGP)",
    mustVisitPlaces: [
      {
        id: 1101,
        name: "Great Pyramid of Giza",
        category: "Ancient Monument",
        description: "Largest and oldest of the three pyramids, built for Pharaoh Khufu.",
        image: "https://example.com/great-pyramid.jpg",
        location: { lat: 29.9792, lng: 31.1342 },
        tips: "Book tickets to enter early. Limited number of internal tickets sold daily.",
        entryFee: "EGP 400 for exterior, additional EGP 400 for interior",
        openingHours: "8 AM - 4 PM"
      },
      {
        id: 1102,
        name: "Great Sphinx",
        category: "Ancient Monument",
        description: "Limestone statue of a mythical creature with human head and lion's body.",
        image: "https://example.com/sphinx.jpg",
        location: { lat: 29.9753, lng: 31.1377 },
        tips: "Visit early morning or late afternoon for best photos. Attend sound and light show.",
        entryFee: "Included in complex ticket",
        openingHours: "8 AM - 4 PM"
      },
      {
        id: 1103,
        name: "Pyramid of Khafre",
        category: "Ancient Monument",
        description: "Second-largest pyramid, appears taller due to higher ground placement.",
        image: "https://example.com/khafre.jpg",
        location: { lat: 29.9759, lng: 31.1309 },
        tips: "Original limestone casing still visible at top. Great photo opportunities.",
        entryFee: "EGP 200 for interior access",
        openingHours: "8 AM - 4 PM"
      },
      {
        id: 1104,
        name: "Solar Boat Museum",
        category: "Museums",
        description: "Houses reconstructed ancient Egyptian boat found near Great Pyramid.",
        image: "https://example.com/solar-boat.jpg",
        location: { lat: 29.9776, lng: 31.1344 },
        tips: "Air-conditioned refuge from heat. Fascinating construction techniques.",
        entryFee: "EGP 100",
        openingHours: "9 AM - 4 PM"
      },
      {
        id: 1105,
        name: "Pyramid of Menkaure",
        category: "Ancient Monument",
        description: "Smallest of the three main pyramids, built for Pharaoh Menkaure.",
        image: "https://example.com/menkaure.jpg",
        location: { lat: 29.9720, lng: 31.1280 },
        tips: "Less crowded than other pyramids. Notice the different construction materials.",
        entryFee: "EGP 100 for interior access",
        openingHours: "8 AM - 4 PM"
      },
      {
        id: 1106,
        name: "Queens' Pyramids",
        category: "Ancient Monument",
        description: "Three smaller pyramids built for queens, located near Great Pyramid.",
        image: "https://example.com/queens-pyramids.jpg",
        location: { lat: 29.9785, lng: 31.1353 },
        tips: "Often overlooked but historically significant. Less crowded area.",
        entryFee: "Included in complex ticket",
        openingHours: "8 AM - 4 PM"
      },
      {
        id: 1107,
        name: "Western Cemetery",
        category: "Archaeological Site",
        description: "Ancient burial ground with mastaba tombs of nobles and officials.",
        image: "https://example.com/western-cemetery.jpg",
        location: { lat: 29.9777, lng: 31.1300 },
        tips: "Hire guide to understand tomb meanings. Less visited but fascinating.",
        entryFee: "Included in complex ticket",
        openingHours: "8 AM - 4 PM"
      },
      {
        id: 1108,
        name: "Valley Temple of Khafre",
        category: "Ancient Monument",
        description: "Well-preserved temple used for pharaoh's mummification process.",
        image: "https://example.com/valley-temple.jpg",
        location: { lat: 29.9757, lng: 31.1343 },
        tips: "Notice the massive granite blocks. Important for understanding ancient rituals.",
        entryFee: "Included in complex ticket",
        openingHours: "8 AM - 4 PM"
      },
      {
        id: 1109,
        name: "Panorama Point",
        category: "Viewpoints",
        description: "Elevated area offering panoramic views of all pyramids.",
        image: "https://example.com/panorama-point.jpg",
        location: { lat: 29.9775, lng: 31.1307 },
        tips: "Best spot for sunset photos. Bring wide-angle lens.",
        entryFee: "Free with complex ticket",
        openingHours: "8 AM - 4 PM"
      },
      {
        id: 1110,
        name: "Giza Plateau",
        category: "Archaeological Site",
        description: "Entire archaeological complex including minor pyramids and tombs.",
        image: "https://example.com/giza-plateau.jpg",
        location: { lat: 29.9773, lng: 31.1325 },
        tips: "Take camel ride for traditional experience. Bring water and sun protection.",
        entryFee: "EGP 200 general admission",
        openingHours: "8 AM - 4 PM"
      }
    ]
  },
  {
    id: 12,
    name: "Great Wall of China",
    description: "Ancient series of walls and fortifications, the longest man-made structure in the world.",
    mainImage: "https://example.com/great-wall-main.jpg",
    facts: [
      "The total length of the Great Wall is approximately 21,196 kilometers.",
      "Construction spanned various dynasties over 2,000 years.",
      "Contrary to popular belief, it is not visible from space with the naked eye.",
      "Rice flour was used as mortar in its construction.",
      "Over 1 million people died during its construction."
    ],
    bestTimeToVisit: "March to May (spring) or September to October (autumn).",
    currency: "Chinese Yuan (CNY)",
    mustVisitPlaces: [
      {
        id: 1201,
        name: "Mutianyu Section",
        category: "Historical Site",
        description: "Well-preserved section with stunning mountain views, less crowded than Badaling.",
        image: "https://example.com/mutianyu.jpg",
        location: { lat: 40.4319, lng: 116.5681 },
        tips: "Take cable car up, toboggan down. Visit early morning to avoid crowds.",
        entryFee: "CNY 45, cable car extra",
        openingHours: "7:30 AM - 5:30 PM"
      },
      {
        id: 1202,
        name: "Badaling",
        category: "Historical Site",
        description: "Most visited section, closest to Beijing and fully restored.",
        image: "https://example.com/badaling.jpg",
        location: { lat: 40.3587, lng: 115.4983 },
        tips: "Very crowded but most accessible. Book tickets online in advance.",
        entryFee: "CNY 40 (peak season)",
        openingHours: "6:30 AM - 5:30 PM"
      },
      {
        id: 1203,
        name: "Jinshanling",
        category: "Historical Site",
        description: "Picturesque section combining restored and original walls.",
        image: "https://example.com/jinshanling.jpg",
        location: { lat: 40.6766, lng: 117.2323 },
        tips: "Best for hiking and photography. Bring good walking shoes.",
        entryFee: "CNY 65",
        openingHours: "8 AM - 5 PM"
      },
      {
        id: 1204,
        name: "Simatai",
        category: "Historical Site",
        description: "Only section open for night visits, features unique architecture.",
        image: "https://example.com/simatai.jpg",
        location: { lat: 40.6457, lng: 117.2754 },
        tips: "Book night tour in advance. Combine with Gubei Water Town visit.",
        entryFee: "CNY 40",
        openingHours: "24/7 (night tours need booking)"
      },
      {
        id: 1205,
        name: "Huanghuacheng",
        category: "Historical Site",
        description: "Lakeside section with unique water elements and mountain views.",
        image: "https://example.com/huanghuacheng.jpg",
        location: { lat: 40.4527, lng: 116.4142 },
        tips: "Visit in summer for wild flowers. Take boat ride on reservoir.",
        entryFee: "CNY 45",
        openingHours: "7:30 AM - 5 PM"
      },
      {
        id: 1206,
        name: "Gubeikou",
        category: "Historical Site",
        description: "Completely wild section with original features, strategic pass location.",
        image: "https://example.com/gubeikou.jpg",
        location: { lat: 40.6866, lng: 117.1683 },
        tips: "Hire experienced guide. Challenging but rewarding hike.",
        entryFee: "CNY 25",
        openingHours: "8 AM - 5 PM"
      },
      {
        id: 1207,
        name: "Shanhai Pass",
        category: "Historical Site",
        description: "Easternmost end of Great Wall, where wall meets the sea.",
        image: "https://example.com/shanhai.jpg",
        location: { lat: 40.0087, lng: 119.7527 },
        tips: "Visit Old Dragon's Head structure. Less crowded than Beijing sections.",
        entryFee: "CNY 50",
        openingHours: "8:30 AM - 5:30 PM"
      },
      {
        id: 1208,
        name: "Great Wall Museum",
        category: "Museums",
        description: "Comprehensive museum about wall's history and construction.",
        image: "https://example.com/wall-museum.jpg",
        location: { lat: 40.3587, lng: 115.4983 },
        tips: "Located at Badaling. Good introduction before wall visit.",
        entryFee: "Free with Badaling ticket",
        openingHours: "8:30 AM - 4:30 PM"
      },
      {
        id: 1209,
        name: "Jiankou",
        category: "Historical Site",
        description: "Unrestored section known for dramatic mountain scenery.",
        image: "https://example.com/jiankou.jpg",
        location: { lat: 40.4310, lng: 116.4513 },
        tips: "For experienced hikers only. Stunning photography location.",
        entryFee: "Free (no formal entrance)",
        openingHours: "24/7 (hiking at own risk)"
      },
      {
        id: 1210,
        name: "Panlongshan",
        category: "Historical Site",
        description: "Lesser-known section featuring unique defensive structures.",
        image: "https://example.com/panlongshan.jpg",
        location: { lat: 40.4561, lng: 116.5372 },
        tips: "Good for avoiding crowds. Interesting military features.",
        entryFee: "CNY 35",
        openingHours: "8 AM - 5 PM"
      }
    ]
  }
];

export default destinations;
