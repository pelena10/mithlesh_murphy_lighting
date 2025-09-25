const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DeliveryNotes = sequelize.define('DeliveryNotes', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  dn_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cash_discount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  order_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  box: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  dn_status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dn_checking: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  invoice_key: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  remark: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  amt: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'delivery_notes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = DeliveryNotes;