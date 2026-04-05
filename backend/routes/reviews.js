const express = require('express');
const { uuidv4, destinations } = require('../data/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

const reviews = [
  { id: '1', destinationId: '1', userId: 'demo', userName: 'Sarah M.', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah', rating: 5, comment: 'Absolutely magical! The sunsets in Oia are unlike anything I have ever seen. Highly recommend!', date: '2024-11-15' },
  { id: '2', destinationId: '1', userId: 'demo2', userName: 'James K.', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=James', rating: 5, comment: 'Perfect honeymoon destination. The cave hotels are incredible and the food is outstanding.', date: '2024-10-22' },
  { id: '3', destinationId: '2', userId: 'demo3', userName: 'Priya R.', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya', rating: 5, comment: 'Kyoto in cherry blossom season is pure poetry. The temples, the food, the culture — perfection.', date: '2024-04-10' },
  { id: '4', destinationId: '3', userId: 'demo4', userName: 'Tom B.', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tom', rating: 5, comment: 'The overwater bungalow experience is out of this world. Crystal clear water right beneath you!', date: '2024-12-01' }
];

// Get reviews for a destination
router.get('/:destId', (req, res) => {
  const destReviews = reviews.filter(r => r.destinationId === req.params.destId);
  res.json(destReviews);
});

// Add review
router.post('/:destId', auth, (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment) return res.status(400).json({ error: 'Rating and comment required' });
  const review = {
    id: uuidv4(),
    destinationId: req.params.destId,
    userId: req.user.id,
    userName: req.user.name,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${req.user.name}`,
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split('T')[0]
  };
  reviews.push(review);
  res.status(201).json(review);
});

module.exports = router;
