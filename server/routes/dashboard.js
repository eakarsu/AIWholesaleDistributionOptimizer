const express = require('express');
const router = express.Router();
const { Territory, Order, CrossSell, Route, Inventory, Customer, Forecast, Supplier, Pricing, Return, SalesRep, DemandPlan, Delivery, Warehouse, Promotion } = require('../models');
const auth = require('../middleware/auth');

router.get('/stats', auth, async (req, res) => {
  try {
    const [territories, orders, crossSells, routes, inventory, customers, forecasts, suppliers, pricing, returns, salesReps, demandPlans, deliveries, warehouses, promotions] = await Promise.all([
      Territory.count(), Order.count(), CrossSell.count(), Route.count(), Inventory.count(),
      Customer.count(), Forecast.count(), Supplier.count(), Pricing.count(), Return.count(),
      SalesRep.count(), DemandPlan.count(), Delivery.count(), Warehouse.count(), Promotion.count()
    ]);
    const totalRevenue = await Order.sum('totalAmount') || 0;
    const avgConfidence = await CrossSell.findOne({
      attributes: [[require('sequelize').fn('AVG', require('sequelize').col('confidence')), 'avgConfidence']]
    });
    res.json({
      territories, orders, crossSells, routes, inventory,
      customers, forecasts, suppliers, pricing, returns, salesReps, demandPlans, deliveries, warehouses, promotions,
      totalRevenue, avgConfidence: avgConfidence?.dataValues?.avgConfidence || 0
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
