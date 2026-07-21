require('dotenv').config();
const { Sequelize } = require('sequelize');

const connection = process.env.DATABASE_URL
  ? [process.env.DATABASE_URL]
  : [process.env.DB_NAME || 'wholesale_optimizer', process.env.DB_USER || 'postgres', process.env.DB_PASSWORD || 'postgres'];

const sequelize = new Sequelize(...connection, {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

module.exports = sequelize;
