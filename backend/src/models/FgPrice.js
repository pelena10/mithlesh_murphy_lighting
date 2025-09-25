const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FgPrice = sequelize.define('FgPrice', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  price_list_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fg_names_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'fg_price',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = FgPrice;
