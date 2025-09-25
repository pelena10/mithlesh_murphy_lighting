const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PriceLists = sequelize.define('PriceLists', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'price_lists',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = PriceLists;
