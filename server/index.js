require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/territories', require('./routes/territories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/crosssell', require('./routes/crosssell'));
app.use('/api/routes', require('./routes/routeOptimization'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/forecasts', require('./routes/forecasts'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/pricing', require('./routes/pricing'));
app.use('/api/returns', require('./routes/returns'));
app.use('/api/salesreps', require('./routes/salesreps'));
app.use('/api/demandplans', require('./routes/demandplans'));
app.use('/api/deliveries', require('./routes/deliveries'));
app.use('/api/warehouses', require('./routes/warehouses'));
app.use('/api/promotions', require('./routes/promotions'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/import', require('./routes/import'));
app.use('/api/users', require('./routes/users'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database sync failed:', err);
});
