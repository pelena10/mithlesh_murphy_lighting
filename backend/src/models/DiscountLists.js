const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DiscountLists = sequelize.define('DiscountLists', {
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
  tableName: 'discount_lists',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = DiscountLists;
