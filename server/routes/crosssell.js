const express = require('express');
const router = express.Router();
const { CrossSell } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const crossSells = await CrossSell.findAll({ order: [['createdAt', 'DESC']] });
    res.json(crossSells);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const crossSell = await CrossSell.findByPk(req.params.id);
    if (!crossSell) return res.status(404).json({ message: 'CrossSell not found' });
    res.json(crossSell);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const crossSell = await CrossSell.create(req.body);
    res.status(201).json(crossSell);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const crossSell = await CrossSell.findByPk(req.params.id);
    if (!crossSell) return res.status(404).json({ message: 'CrossSell not found' });
    await crossSell.update(req.body);
    res.json(crossSell);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const crossSell = await CrossSell.findByPk(req.params.id);
    if (!crossSell) return res.status(404).json({ message: 'CrossSell not found' });
    await crossSell.destroy();
    res.json({ message: 'CrossSell deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
