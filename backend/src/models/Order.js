const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  workflow_instance_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  document_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  order_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cust_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  order_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  expected_delivery_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actual_delivery_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  order_status: {
    type: DataTypes.ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
    defaultValue: 'Pending',
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  discount_amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  tax_amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  grand_total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Order;
