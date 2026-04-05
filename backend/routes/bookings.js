const express = require('express');
const { bookings, destinations, uuidv4 } = require('../data/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Create booking
router.post('/', auth, (req, res) => {
  const { destinationId, travelers, startDate, endDate, specialRequests } = req.body;
  if (!destinationId || !travelers || !startDate || !endDate)
    return res.status(400).json({ error: 'Missing required fields' });

  const dest = destinations.find(d => d.id === destinationId);
  if (!dest) return res.status(404).json({ error: 'Destination not found' });

  const nights = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const total = dest.price * travelers;

  const booking = {
    id: uuidv4(),
    userId: req.user.id,
    destination: { id: dest.id, name: dest.name, country: dest.country, image: dest.image },
    travelers: Number(travelers),
    startDate,
    endDate,
    nights,
    total,
    specialRequests: specialRequests || '',
    status: 'confirmed',
    bookingRef: 'WL' + Math.random().toString(36).substr(2, 8).toUpperCase(),
    createdAt: new Date().toISOString()
  };
  bookings.push(booking);
  res.status(201).json(booking);
});

// Get my bookings
router.get('/my', auth, (req, res) => {
  const myBookings = bookings.filter(b => b.userId === req.user.id);
  res.json(myBookings);
});

// Get single booking
router.get('/:id', auth, (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id && b.userId === req.user.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  res.json(booking);
});

// Cancel booking
router.patch('/:id/cancel', auth, (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id && b.userId === req.user.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  booking.status = 'cancelled';
  res.json(booking);
});

module.exports = router;
