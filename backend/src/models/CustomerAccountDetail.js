const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CustomerAccountDetail = sequelize.define('CustomerAccountDetail', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cust_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tally_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cust_branch: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dispatch_store: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cust_category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price_list_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  disc_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sales_person: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  allocated_cre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  zone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'customer_account_details',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = CustomerAccountDetail;
