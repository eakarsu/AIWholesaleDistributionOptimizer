const express = require('express');
const router = express.Router();
const { AuditLog } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try { res.json(await AuditLog.findAll({ order: [['createdAt', 'DESC']], limit: 500 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/entity/:type/:id', auth, async (req, res) => {
  try { res.json(await AuditLog.findAll({ where: { entityType: req.params.type, entityId: req.params.id }, order: [['createdAt', 'DESC']] })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
module.exports = router;
