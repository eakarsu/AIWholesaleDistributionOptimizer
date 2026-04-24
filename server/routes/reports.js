const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Order, Customer, Inventory, Supplier, Delivery, Invoice, SalesRep, Territory } = require('../models');
const auth = require('../middleware/auth');

const models = { customers: Customer, orders: Order, inventory: Inventory, suppliers: Supplier, deliveries: Delivery, invoices: Invoice, salesreps: SalesRep };

const toCSV = (records) => {
  if (!records.length) return '';
  const data = records.map(r => r.toJSON ? r.toJSON() : r);
  const headers = Object.keys(data[0]).filter(k => k !== 'password');
  const rows = data.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','));
  return [headers.join(','), ...rows].join('\n');
};

router.get('/export/:entity', auth, async (req, res) => {
  try {
    const Model = models[req.params.entity];
    if (!Model) return res.status(400).json({ message: 'Invalid entity. Valid: ' + Object.keys(models).join(', ') });
    const records = await Model.findAll({ order: [['createdAt', 'DESC']] });
    const csv = toCSV(records);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${req.params.entity}_export.csv"`);
    res.send(csv);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/summary', auth, async (req, res) => {
  try {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalRevenue, totalCustomers, ordersThisMonth, topCustomers, topTerritories, lowStock, overdueDeliveries] = await Promise.all([
      Order.sum('totalAmount') || 0,
      Customer.count(),
      Order.count({ where: { orderDate: { [Op.gte]: firstOfMonth } } }),
      Customer.findAll({ order: [['lifetimeValue', 'DESC']], limit: 5, attributes: ['id', 'companyName', 'lifetimeValue', 'totalOrders', 'segment'] }),
      Territory.findAll({ order: [['annualRevenue', 'DESC']], limit: 5, attributes: ['id', 'name', 'region', 'annualRevenue', 'customerCount'] }),
      Inventory.findAll({ where: { currentStock: { [Op.lte]: require('sequelize').col('reorderPoint') } }, attributes: ['id', 'productName', 'sku', 'currentStock', 'reorderPoint', 'warehouse'] }),
      Delivery.findAll({ where: { estimatedDelivery: { [Op.lt]: now }, status: { [Op.ne]: 'Delivered' } }, attributes: ['id', 'trackingNumber', 'customerName', 'estimatedDelivery', 'status'] })
    ]);

    res.json({ totalRevenue: totalRevenue || 0, totalCustomers, ordersThisMonth, topCustomers, topTerritories, lowStock, overdueDeliveries });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
