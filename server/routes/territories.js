const express = require('express');
const router = express.Router();
const { Territory } = require('../models');
const auth = require('../middleware/auth');

// Get all territories
router.get('/', auth, async (req, res) => {
  try {
    const territories = await Territory.findAll({ order: [['createdAt', 'DESC']] });
    res.json(territories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single territory
router.get('/:id', auth, async (req, res) => {
  try {
    const territory = await Territory.findByPk(req.params.id);
    if (!territory) return res.status(404).json({ message: 'Territory not found' });
    res.json(territory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create territory
router.post('/', auth, async (req, res) => {
  try {
    const territory = await Territory.create(req.body);
    res.status(201).json(territory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update territory
router.put('/:id', auth, async (req, res) => {
  try {
    const territory = await Territory.findByPk(req.params.id);
    if (!territory) return res.status(404).json({ message: 'Territory not found' });
    await territory.update(req.body);
    res.json(territory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete territory
router.delete('/:id', auth, async (req, res) => {
  try {
    const territory = await Territory.findByPk(req.params.id);
    if (!territory) return res.status(404).json({ message: 'Territory not found' });
    await territory.destroy();
    res.json({ message: 'Territory deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
