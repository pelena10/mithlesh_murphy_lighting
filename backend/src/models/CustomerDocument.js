const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CustomerDocument = sequelize.define('CustomerDocument', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cust_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  shop_image_1: {
    type: DataTypes.STRING, // file path or URL
    allowNull: true,
  },
  shop_image_2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shop_image_3: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shop_image_4: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image_security_cheque_1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image_security_cheque_2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image_security_cheque_3: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image_security_cheque_4: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gst_certificate_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'customer_documents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = CustomerDocument;
