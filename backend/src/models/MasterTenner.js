const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MasterTenner = sequelize.define('MasterTenner', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fg_names_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  master: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tanner: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_master_restricted: {
    type: DataTypes.BOOLEAN, 
    allowNull: true,
    defaultValue: false,
  },
  is_tenner_restricted: {
    type: DataTypes.BOOLEAN, 
    allowNull: true,
    defaultValue: false,
  },
}, {
  tableName: 'master_tenner',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = MasterTenner;