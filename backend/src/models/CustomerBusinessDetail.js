const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CustomerBusinessDetail = sequelize.define('CustomerBusinessDetail', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cust_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  annual_turnover: {
    type: DataTypes.DECIMAL(15, 2), // or STRING if you want free text
    allowNull: true,
  },
  no_counters_in_chain: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  list_of_other_products: {
    type: DataTypes.TEXT, // large text for comma-separated or JSON string
    allowNull: true,
  },
  list_of_other_companies: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  appoint_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  shop_location_link: {
    type: DataTypes.STRING,
    allowNull: true,
    // validate: { isUrl: true },
  },
}, {
  tableName: 'customer_business_details',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = CustomerBusinessDetail;
