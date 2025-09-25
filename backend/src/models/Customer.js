const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cust_name: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true,
  },
  gst_no: {
    type: DataTypes.STRING,
    allowNull: true,
    // unique: true,
  },
  udyam_reg_no: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  cust_status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active',
  },
  pan: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  aadhar: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  cust_rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  }

}, {
  tableName: 'customers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Customer;
