const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Right = sequelize.define('Right', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dep_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'rights',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Right;
