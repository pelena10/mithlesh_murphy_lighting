const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FgName = sequelize.define('FgName', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fg_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fg_code: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'fg_names',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = FgName;
