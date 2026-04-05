const { v4: uuidv4 } = require('uuid');

const destinations = [
  {
    id: '1',
    name: 'Santorini',
    country: 'Greece',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800',
      'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=800'
    ],
    rating: 4.9,
    reviews: 2847,
    price: 1299,
    duration: '7 days',
    category: ['beach', 'romantic', 'luxury'],
    description: 'Perched on volcanic cliffs, Santorini dazzles with its iconic white-washed buildings, blue-domed churches, and breathtaking Aegean sunsets. A paradise for romance and relaxation.',
    highlights: ['Oia Sunset Views', 'Wine Tasting Tours', 'Volcanic Black Sand Beaches', 'Ancient Akrotiri Ruins'],
    weather: { temp: '27°C', season: 'Summer', bestTime: 'Jun–Sep' },
    included: ['Flights', 'Hotel (7 nights)', 'Daily Breakfast', 'Island Tour', 'Airport Transfers'],
    tags: ['Trending', 'Romantic']
  },
  {
    id: '2',
    name: 'Kyoto',
    country: 'Japan',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
      'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800'
    ],
    rating: 4.8,
    reviews: 3124,
    price: 1599,
    duration: '8 days',
    category: ['cultural', 'nature', 'spiritual'],
    description: "Japan's ancient imperial capital where over 1,600 Buddhist temples and 400 Shinto shrines coexist with geisha districts, bamboo groves, and world-class kaiseki cuisine.",
    highlights: ['Arashiyama Bamboo Grove', 'Fushimi Inari Shrine', 'Geisha District Gion', 'Traditional Tea Ceremony'],
    weather: { temp: '22°C', season: 'Spring/Autumn', bestTime: 'Mar–May, Oct–Nov' },
    included: ['Flights', 'Ryokan Stay (8 nights)', 'Breakfast & Dinner', 'JR Pass', 'Tea Ceremony'],
    tags: ['Cultural', 'Top Rated']
  },
  {
    id: '3',
    name: 'Maldives',
    country: 'Maldives',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800',
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
      'https://images.unsplash.com/photo-1540202404-1b927e27fa8b?w=800'
    ],
    rating: 5.0,
    reviews: 1956,
    price: 2499,
    duration: '6 days',
    category: ['beach', 'luxury', 'romantic'],
    description: 'Crystal-clear turquoise lagoons, overwater bungalows, and pristine coral reefs make the Maldives the ultimate luxury escape. Snorkel with manta rays and sleep above the Indian Ocean.',
    highlights: ['Overwater Bungalow Stay', 'Coral Reef Snorkeling', 'Dolphin Watching', 'Sunset Cruise'],
    weather: { temp: '30°C', season: 'Dry Season', bestTime: 'Nov–Apr' },
    included: ['Seaplane Transfer', 'Overwater Villa (6 nights)', 'All-Inclusive Meals', 'Snorkeling Gear', 'Sunset Cruise'],
    tags: ['Luxury', 'Romantic']
  },
  {
    id: '4',
    name: 'Machu Picchu',
    country: 'Peru',
    continent: 'South America',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800',
      'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=800',
      'https://images.unsplash.com/photo-1628413974872-8f53f8da1b46?w=800'
    ],
    rating: 4.9,
    reviews: 4230,
    price: 1899,
    duration: '9 days',
    category: ['adventure', 'cultural', 'nature'],
    description: "The Lost City of the Incas, hidden high in the Andes at 2,430m. This UNESCO World Heritage Site is one of humanity's greatest architectural achievements, wrapped in mystical cloud forests.",
    highlights: ['Inca Trail Trek', 'Sun Gate Sunrise', 'Aguas Calientes Hot Springs', 'Cusco City Tour'],
    weather: { temp: '17°C', season: 'Dry Season', bestTime: 'May–Oct' },
    included: ['Flights', 'Hotels (9 nights)', 'Guided Trek', 'Train to Aguas Calientes', 'Entrance Fees'],
    tags: ['Adventure', 'UNESCO']
  },
  {
    id: '5',
    name: 'Amalfi Coast',
    country: 'Italy',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1548018560-c7196548b68b?w=800',
      'https://images.unsplash.com/photo-1569949095562-4a07ea2e27d7?w=800',
      'https://images.unsplash.com/photo-1563656268-42a990e94906?w=800'
    ],
    rating: 4.7,
    reviews: 2651,
    price: 1749,
    duration: '7 days',
    category: ['beach', 'romantic', 'cultural'],
    description: 'Dramatic cliffs cascading into a sparkling Mediterranean sea, pastel-colored villages, and world-class limoncello. The Amalfi Coast is Italy at its most theatrical and gorgeous.',
    highlights: ['Positano Village', 'Boat Tour to Capri', 'Ravello Gardens', 'Authentic Cooking Class'],
    weather: { temp: '28°C', season: 'Summer', bestTime: 'May–Sep' },
    included: ['Flights', 'Boutique Hotel (7 nights)', 'Daily Breakfast', 'Boat Tour', 'Cooking Class'],
    tags: ['Romantic', 'Scenic']
  },
  {
    id: '6',
    name: 'Safari Kenya',
    country: 'Kenya',
    continent: 'Africa',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
      'https://images.unsplash.com/photo-1621414050345-53db43f7e7ab?w=800',
      'https://images.unsplash.com/photo-1555169062-013468b47731?w=800'
    ],
    rating: 4.9,
    reviews: 1823,
    price: 3299,
    duration: '10 days',
    category: ['adventure', 'nature', 'wildlife'],
    description: 'Witness the greatest wildlife spectacle on Earth — the Great Migration in the Masai Mara. Lions, elephants, leopards, and millions of wildebeest on the sweeping golden savannah.',
    highlights: ['Big Five Game Drives', 'Great Migration', 'Hot Air Balloon Safari', 'Maasai Village Visit'],
    weather: { temp: '25°C', season: 'Dry', bestTime: 'Jul–Oct' },
    included: ['Flights', 'Safari Lodge (10 nights)', 'Full Board', 'Game Drives', 'Balloon Safari'],
    tags: ['Adventure', 'Wildlife']
  },
  {
    id: '7',
    name: 'Bali',
    country: 'Indonesia',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800',
      'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800'
    ],
    rating: 4.8,
    reviews: 5102,
    price: 999,
    duration: '8 days',
    category: ['beach', 'spiritual', 'cultural', 'nature'],
    description: "The Island of the Gods — terraced rice paddies, ancient Hindu temples, world-class surfing, and a deeply spiritual culture make Bali one of the world's most beloved destinations.",
    highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Traditional Kecak Dance'],
    weather: { temp: '29°C', season: 'Dry Season', bestTime: 'Apr–Oct' },
    included: ['Flights', 'Villa with Pool (8 nights)', 'Daily Breakfast', 'Temple Tour', 'Cooking Class'],
    tags: ['Popular', 'Value']
  },
  {
    id: '8',
    name: 'Northern Lights Iceland',
    country: 'Iceland',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800',
      'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800',
      'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800'
    ],
    rating: 4.8,
    reviews: 1647,
    price: 2199,
    duration: '7 days',
    category: ['adventure', 'nature', 'luxury'],
    description: "Chase the magical Aurora Borealis across Iceland's otherworldly landscape of geysers, glaciers, and volcanic craters. Soak in the Blue Lagoon under dancing green lights.",
    highlights: ['Aurora Borealis Hunting', 'Blue Lagoon Geothermal Spa', 'Golden Circle Tour', 'Glacier Hiking'],
    weather: { temp: '-2°C', season: 'Winter', bestTime: 'Sep–Mar' },
    included: ['Flights', 'Hotel (7 nights)', 'Northern Lights Tour', 'Golden Circle Tour', 'Blue Lagoon Entry'],
    tags: ['Unique', 'Nature']
  }
];

const users = [];
const bookings = [];
const wishlist = {};

module.exports = { destinations, users, bookings, wishlist, uuidv4 };
