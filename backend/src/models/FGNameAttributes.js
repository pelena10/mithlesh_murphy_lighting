const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FGNameAttributes = sequelize.define('FGNameAttributes', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fg_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fg_unit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Bis_applicable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  Vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bis_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hsn_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  master: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tanner: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_master_restricted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  is_tanner_restricted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  oem: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  rtp: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },

}, {
  tableName: 'fg_name_attributes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = FGNameAttributes;
