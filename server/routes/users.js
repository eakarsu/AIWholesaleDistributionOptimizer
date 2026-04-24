const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try { res.json(await User.findAll({ attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']] })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/:id', auth, async (req, res) => {
  try { const item = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } }); if (!item) return res.status(404).json({ message: 'Not found' }); res.json(item); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role || 'user' });
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await User.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    const { name, email, role } = req.body;
    await item.update({ name, email, role });
    const { password: _, ...userWithoutPassword } = item.toJSON();
    res.json(userWithoutPassword);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.id === parseInt(req.params.id)) return res.status(400).json({ message: 'Cannot delete your own account' });
    const item = await User.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
module.exports = router;
