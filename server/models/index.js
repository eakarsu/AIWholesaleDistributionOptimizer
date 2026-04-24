const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// User Model
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'user' }
});

// Territory Model
const Territory = sequelize.define('Territory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  region: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING },
  zipCodes: { type: DataTypes.TEXT },
  assignedRep: { type: DataTypes.STRING },
  customerCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  annualRevenue: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  growthRate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  marketPotential: { type: DataTypes.STRING, defaultValue: 'Medium' },
  status: { type: DataTypes.STRING, defaultValue: 'Active' },
  notes: { type: DataTypes.TEXT }
});

// Order Model
const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  customerName: { type: DataTypes.STRING, allowNull: false },
  customerEmail: { type: DataTypes.STRING },
  territory: { type: DataTypes.STRING },
  products: { type: DataTypes.TEXT },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  unitPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  totalAmount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
  orderDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  deliveryDate: { type: DataTypes.DATE },
  frequency: { type: DataTypes.STRING, defaultValue: 'One-time' },
  pattern: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT }
});

// CrossSell Model
const CrossSell = sequelize.define('CrossSell', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customerName: { type: DataTypes.STRING, allowNull: false },
  currentProducts: { type: DataTypes.TEXT, allowNull: false },
  recommendedProduct: { type: DataTypes.STRING, allowNull: false },
  confidence: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  estimatedRevenue: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  reason: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
  priority: { type: DataTypes.STRING, defaultValue: 'Medium' },
  lastPurchaseDate: { type: DataTypes.DATE },
  territory: { type: DataTypes.STRING }
});

// Route Model
const Route = sequelize.define('Route', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  routeName: { type: DataTypes.STRING, allowNull: false },
  driverName: { type: DataTypes.STRING, allowNull: false },
  territory: { type: DataTypes.STRING },
  stops: { type: DataTypes.TEXT },
  totalDistance: { type: DataTypes.DECIMAL(8, 2), defaultValue: 0 },
  estimatedTime: { type: DataTypes.STRING },
  fuelCost: { type: DataTypes.DECIMAL(8, 2), defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'Planned' },
  scheduledDate: { type: DataTypes.DATE },
  vehicleType: { type: DataTypes.STRING, defaultValue: 'Truck' },
  optimizationScore: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  notes: { type: DataTypes.TEXT }
});

// Inventory Model
const Inventory = sequelize.define('Inventory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productName: { type: DataTypes.STRING, allowNull: false },
  sku: { type: DataTypes.STRING, unique: true, allowNull: false },
  category: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING, allowNull: false },
  warehouse: { type: DataTypes.STRING },
  currentStock: { type: DataTypes.INTEGER, defaultValue: 0 },
  minStock: { type: DataTypes.INTEGER, defaultValue: 0 },
  maxStock: { type: DataTypes.INTEGER, defaultValue: 0 },
  reorderPoint: { type: DataTypes.INTEGER, defaultValue: 0 },
  unitCost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  totalValue: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  turnoverRate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'In Stock' },
  lastRestocked: { type: DataTypes.DATE },
  notes: { type: DataTypes.TEXT }
});

// Customer Model
const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  companyName: { type: DataTypes.STRING, allowNull: false },
  contactName: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT },
  territory: { type: DataTypes.STRING },
  segment: { type: DataTypes.STRING, defaultValue: 'Standard' },
  lifetimeValue: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  totalOrders: { type: DataTypes.INTEGER, defaultValue: 0 },
  avgOrderValue: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  paymentTerms: { type: DataTypes.STRING, defaultValue: 'Net 30' },
  creditLimit: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'Active' },
  lastOrderDate: { type: DataTypes.DATE },
  notes: { type: DataTypes.TEXT }
});

// Forecast Model
const Forecast = sequelize.define('Forecast', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  territory: { type: DataTypes.STRING, allowNull: false },
  product: { type: DataTypes.STRING },
  period: { type: DataTypes.STRING, allowNull: false },
  forecastedRevenue: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  actualRevenue: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  variance: { type: DataTypes.DECIMAL(8, 2), defaultValue: 0 },
  confidence: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  growthRate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  method: { type: DataTypes.STRING, defaultValue: 'AI Model' },
  status: { type: DataTypes.STRING, defaultValue: 'Active' },
  notes: { type: DataTypes.TEXT }
});

// Supplier Model
const Supplier = sequelize.define('Supplier', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  companyName: { type: DataTypes.STRING, allowNull: false },
  contactName: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING },
  leadTimeDays: { type: DataTypes.INTEGER, defaultValue: 7 },
  reliabilityScore: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  totalOrders: { type: DataTypes.INTEGER, defaultValue: 0 },
  onTimeDeliveryRate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  qualityRating: { type: DataTypes.DECIMAL(3, 1), defaultValue: 0 },
  paymentTerms: { type: DataTypes.STRING, defaultValue: 'Net 30' },
  status: { type: DataTypes.STRING, defaultValue: 'Active' },
  contractExpiry: { type: DataTypes.DATE },
  notes: { type: DataTypes.TEXT }
});

// Pricing Model
const Pricing = sequelize.define('Pricing', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productName: { type: DataTypes.STRING, allowNull: false },
  sku: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  baseCost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  currentPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  suggestedPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  margin: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  competitorPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  demandLevel: { type: DataTypes.STRING, defaultValue: 'Medium' },
  priceElasticity: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  lastUpdated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  strategy: { type: DataTypes.STRING, defaultValue: 'Standard' },
  status: { type: DataTypes.STRING, defaultValue: 'Active' },
  notes: { type: DataTypes.TEXT }
});

// Return Model
const Return = sequelize.define('Return', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  returnNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  orderNumber: { type: DataTypes.STRING },
  customerName: { type: DataTypes.STRING, allowNull: false },
  product: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  reason: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING, defaultValue: 'Return' },
  refundAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
  territory: { type: DataTypes.STRING },
  filedDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  resolvedDate: { type: DataTypes.DATE },
  resolution: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT }
});

// SalesRep Model
const SalesRep = sequelize.define('SalesRep', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  territory: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING },
  quota: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  actualSales: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  attainment: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  totalDeals: { type: DataTypes.INTEGER, defaultValue: 0 },
  avgDealSize: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  winRate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  customerCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  rank: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'Active' },
  hireDate: { type: DataTypes.DATE },
  notes: { type: DataTypes.TEXT }
});

// DemandPlan Model
const DemandPlan = sequelize.define('DemandPlan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productName: { type: DataTypes.STRING, allowNull: false },
  sku: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING, allowNull: false },
  currentDemand: { type: DataTypes.INTEGER, defaultValue: 0 },
  forecastedDemand: { type: DataTypes.INTEGER, defaultValue: 0 },
  seasonalFactor: { type: DataTypes.DECIMAL(5, 2), defaultValue: 1.0 },
  trendDirection: { type: DataTypes.STRING, defaultValue: 'Stable' },
  confidence: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  period: { type: DataTypes.STRING },
  recommendedStock: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'Active' },
  notes: { type: DataTypes.TEXT }
});

// Delivery Model
const Delivery = sequelize.define('Delivery', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  trackingNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  orderNumber: { type: DataTypes.STRING },
  customerName: { type: DataTypes.STRING, allowNull: false },
  origin: { type: DataTypes.STRING },
  destination: { type: DataTypes.STRING },
  carrier: { type: DataTypes.STRING },
  estimatedDelivery: { type: DataTypes.DATE },
  actualDelivery: { type: DataTypes.DATE },
  weight: { type: DataTypes.DECIMAL(8, 2), defaultValue: 0 },
  cost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'In Transit' },
  territory: { type: DataTypes.STRING },
  priority: { type: DataTypes.STRING, defaultValue: 'Standard' },
  notes: { type: DataTypes.TEXT }
});

// Warehouse Model
const Warehouse = sequelize.define('Warehouse', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.STRING, unique: true },
  address: { type: DataTypes.TEXT },
  region: { type: DataTypes.STRING },
  capacity: { type: DataTypes.INTEGER, defaultValue: 0 },
  currentUtilization: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  manager: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  operatingHours: { type: DataTypes.STRING },
  temperatureControlled: { type: DataTypes.BOOLEAN, defaultValue: false },
  dockCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  monthlyOperatingCost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'Active' },
  notes: { type: DataTypes.TEXT }
});

// Promotion Model
const Promotion = sequelize.define('Promotion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, defaultValue: 'Discount' },
  product: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  discountPercent: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  startDate: { type: DataTypes.DATE },
  endDate: { type: DataTypes.DATE },
  territory: { type: DataTypes.STRING },
  targetSegment: { type: DataTypes.STRING },
  estimatedImpact: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  actualImpact: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  redemptions: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'Active' },
  notes: { type: DataTypes.TEXT }
});

// AuditLog Model
const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER },
  userName: { type: DataTypes.STRING },
  action: { type: DataTypes.STRING, allowNull: false },
  entityType: { type: DataTypes.STRING, allowNull: false },
  entityId: { type: DataTypes.INTEGER },
  entityName: { type: DataTypes.STRING },
  changes: { type: DataTypes.TEXT },
  ipAddress: { type: DataTypes.STRING },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// Notification Model
const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.STRING, defaultValue: 'info' },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING },
  relatedEntity: { type: DataTypes.STRING },
  relatedEntityId: { type: DataTypes.INTEGER },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  priority: { type: DataTypes.STRING, defaultValue: 'Medium' },
  userId: { type: DataTypes.INTEGER }
});

// Invoice Model
const Invoice = sequelize.define('Invoice', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  invoiceNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  orderNumber: { type: DataTypes.STRING },
  customerName: { type: DataTypes.STRING, allowNull: false },
  customerEmail: { type: DataTypes.STRING },
  billingAddress: { type: DataTypes.TEXT },
  items: { type: DataTypes.TEXT },
  subtotal: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  taxRate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  taxAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  totalAmount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'Draft' },
  dueDate: { type: DataTypes.DATE },
  paidDate: { type: DataTypes.DATE },
  paymentMethod: { type: DataTypes.STRING },
  territory: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT }
});

// Setting Model
const Setting = sequelize.define('Setting', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  key: { type: DataTypes.STRING, unique: true, allowNull: false },
  value: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING, defaultValue: 'general' },
  description: { type: DataTypes.STRING }
});

module.exports = { sequelize, User, Territory, Order, CrossSell, Route, Inventory, Customer, Forecast, Supplier, Pricing, Return, SalesRep, DemandPlan, Delivery, Warehouse, Promotion, AuditLog, Notification, Invoice, Setting };
