const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FgCodePrefix = sequelize.define('FgCodePrefix', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  short_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'fg_code_prefixs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = FgCodePrefix;
