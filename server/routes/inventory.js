const express = require('express');
const router = express.Router();
const { Inventory } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const inventory = await Inventory.findAll({ order: [['createdAt', 'DESC']] });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });
    await item.destroy();
    res.json({ message: 'Inventory item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
