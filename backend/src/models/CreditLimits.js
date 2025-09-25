const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CreditLimits = sequelize.define('DeliveryNotesDetails', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cust_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  credit_limit: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'credit_limits',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = CreditLimits;