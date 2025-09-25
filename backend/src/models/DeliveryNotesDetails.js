const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DeliveryNotesDetails = sequelize.define('DeliveryNotesDetails', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  delivery_notes_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  dn_item_details: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  month_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order_qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dispatch_qty: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  dp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'delivery_note_details',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = DeliveryNotesDetails;