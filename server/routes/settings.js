const express = require('express');
const router = express.Router();
const { Setting } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try { res.json(await Setting.findAll({ order: [['category', 'ASC'], ['key', 'ASC']] })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/:key', auth, async (req, res) => {
  try { const item = await Setting.findOne({ where: { key: req.params.key } }); if (!item) return res.status(404).json({ message: 'Not found' }); res.json(item); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/:key', auth, async (req, res) => {
  try {
    const [item, created] = await Setting.findOrCreate({ where: { key: req.params.key }, defaults: { ...req.body, key: req.params.key } });
    if (!created) await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/bulk', auth, async (req, res) => {
  try {
    const settings = req.body;
    for (const s of settings) {
      const [item, created] = await Setting.findOrCreate({ where: { key: s.key }, defaults: s });
      if (!created) await item.update(s);
    }
    res.json({ message: 'Settings updated', count: settings.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
module.exports = router;
