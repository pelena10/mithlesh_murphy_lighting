const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CustomerShippingAddress = sequelize.define('CustomerShippingAddress', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cust_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  shipping_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shipping_city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shipping_district: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shipping_state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shipping_pin_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'customer_shipping_addresses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = CustomerShippingAddress;
