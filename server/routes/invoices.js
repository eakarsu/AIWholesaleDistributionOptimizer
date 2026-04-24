const express = require('express');
const router = express.Router();
const { Invoice } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try { res.json(await Invoice.findAll({ order: [['createdAt', 'DESC']] })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/:id', auth, async (req, res) => {
  try { const item = await Invoice.findByPk(req.params.id); if (!item) return res.status(404).json({ message: 'Not found' }); res.json(item); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/', auth, async (req, res) => {
  try {
    const count = await Invoice.count();
    const invoiceNumber = `INV-${String(count + 1001).padStart(5, '0')}`;
    res.status(201).json(await Invoice.create({ ...req.body, invoiceNumber }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/:id', auth, async (req, res) => {
  try { const item = await Invoice.findByPk(req.params.id); if (!item) return res.status(404).json({ message: 'Not found' }); await item.update(req.body); res.json(item); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.delete('/:id', auth, async (req, res) => {
  try { const item = await Invoice.findByPk(req.params.id); if (!item) return res.status(404).json({ message: 'Not found' }); await item.destroy(); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
module.exports = router;
