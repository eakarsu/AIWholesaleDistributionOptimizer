const express = require('express');
const router = express.Router();
const { Route } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const routes = await Route.findAll({ order: [['createdAt', 'DESC']] });
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json(route);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json(route);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    await route.update(req.body);
    res.json(route);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    await route.destroy();
    res.json({ message: 'Route deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
