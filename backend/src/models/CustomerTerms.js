const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CustomerTerms = sequelize.define('CustomerTerms', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_additional_details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  customers_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cust_category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  payment_terms: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price_list_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  disc_list_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cust_branch: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dispatch_store: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sales_person: {
    type: DataTypes.STRING,
    allowNull: true
  },
  allocated_cre: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zone: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'customer_terms',
  timestamps: false 
});

module.exports = CustomerTerms;
