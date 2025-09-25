const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RoleRight = sequelize.define('RoleRight', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  right_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'role_rights',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = RoleRight;
