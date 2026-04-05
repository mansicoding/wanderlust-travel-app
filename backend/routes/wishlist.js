const express = require('express');
const { wishlist, destinations } = require('../data/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get wishlist
router.get('/', auth, (req, res) => {
  const ids = wishlist[req.user.id] || [];
  const items = destinations.filter(d => ids.includes(d.id));
  res.json(items);
});

// Toggle wishlist
router.post('/toggle/:destId', auth, (req, res) => {
  const uid = req.user.id;
  const did = req.params.destId;
  if (!wishlist[uid]) wishlist[uid] = [];
  const idx = wishlist[uid].indexOf(did);
  if (idx === -1) {
    wishlist[uid].push(did);
    res.json({ saved: true });
  } else {
    wishlist[uid].splice(idx, 1);
    res.json({ saved: false });
  }
});

// Check if saved
router.get('/check/:destId', auth, (req, res) => {
  const ids = wishlist[req.user.id] || [];
  res.json({ saved: ids.includes(req.params.destId) });
});

module.exports = router;
