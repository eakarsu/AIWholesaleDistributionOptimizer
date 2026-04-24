const express = require('express');
const router = express.Router();
const { Customer, Order, Inventory, Supplier } = require('../models');
const auth = require('../middleware/auth');

const models = { customers: Customer, orders: Order, inventory: Inventory, suppliers: Supplier };

router.post('/:entity', auth, async (req, res) => {
  try {
    const Model = models[req.params.entity];
    if (!Model) return res.status(400).json({ message: 'Invalid entity. Valid: ' + Object.keys(models).join(', ') });
    const records = req.body;
    if (!Array.isArray(records) || records.length === 0) return res.status(400).json({ message: 'Request body must be a non-empty array of records' });
    const created = await Model.bulkCreate(records, { validate: true });
    res.status(201).json({ message: `Imported ${created.length} records`, count: created.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
