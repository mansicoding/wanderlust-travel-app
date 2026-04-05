const express = require('express');
const { destinations } = require('../data/db');
const router = express.Router();

// Get all destinations with filters
router.get('/', (req, res) => {
  let results = [...destinations];
  const { search, category, continent, minPrice, maxPrice, sort } = req.query;

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q)
    );
  }
  if (category) results = results.filter(d => d.category.includes(category));
  if (continent) results = results.filter(d => d.continent === continent);
  if (minPrice) results = results.filter(d => d.price >= Number(minPrice));
  if (maxPrice) results = results.filter(d => d.price <= Number(maxPrice));

  if (sort === 'price-asc') results.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') results.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') results.sort((a, b) => b.rating - a.rating);
  else if (sort === 'popular') results.sort((a, b) => b.reviews - a.reviews);

  res.json({ count: results.length, destinations: results });
});

// Get single destination
router.get('/:id', (req, res) => {
  const dest = destinations.find(d => d.id === req.params.id);
  if (!dest) return res.status(404).json({ error: 'Destination not found' });
  res.json(dest);
});

// Get featured (top rated)
router.get('/featured/top', (req, res) => {
  const featured = [...destinations].sort((a, b) => b.rating - a.rating).slice(0, 4);
  res.json(featured);
});

// Get categories
router.get('/meta/categories', (req, res) => {
  const cats = [...new Set(destinations.flatMap(d => d.category))];
  res.json(cats);
});

// Get continents
router.get('/meta/continents', (req, res) => {
  const conts = [...new Set(destinations.map(d => d.continent))];
  res.json(conts);
});

module.exports = router;
