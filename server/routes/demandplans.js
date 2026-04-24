const express = require('express');
const router = express.Router();
const { DemandPlan } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try { res.json(await DemandPlan.findAll({ order: [['createdAt', 'DESC']] })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/:id', auth, async (req, res) => {
  try { const item = await DemandPlan.findByPk(req.params.id); if (!item) return res.status(404).json({ message: 'Not found' }); res.json(item); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/', auth, async (req, res) => {
  try { res.status(201).json(await DemandPlan.create(req.body)); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/:id', auth, async (req, res) => {
  try { const item = await DemandPlan.findByPk(req.params.id); if (!item) return res.status(404).json({ message: 'Not found' }); await item.update(req.body); res.json(item); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.delete('/:id', auth, async (req, res) => {
  try { const item = await DemandPlan.findByPk(req.params.id); if (!item) return res.status(404).json({ message: 'Not found' }); await item.destroy(); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
module.exports = router;
