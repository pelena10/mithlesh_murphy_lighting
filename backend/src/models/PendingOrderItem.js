const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PendingOrderItem = sequelize.define('PendingOrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cust_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  order_qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dispatch_qty: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pendingqty: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  dp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'pending_order_item',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = PendingOrderItem;