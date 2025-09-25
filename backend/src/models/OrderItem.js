const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
   cust_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  approved_quantity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  approved_rate: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Order_Id: DataTypes.STRING,
  product_id: DataTypes.INTEGER,
  product_name: DataTypes.STRING,
  discount: DataTypes.FLOAT,

  quantity: DataTypes.INTEGER,
  dp: DataTypes.FLOAT,
  discount: DataTypes.FLOAT,
  project_discount: DataTypes.FLOAT,
  amount: DataTypes.FLOAT,

  ho_fg_store: DataTypes.INTEGER,
  pt_fg_store: DataTypes.INTEGER,
  ho_rndo: DataTypes.INTEGER,
  in_fg_store: DataTypes.INTEGER,
  jb_fg_store: DataTypes.INTEGER,

  master: DataTypes.BOOLEAN,
  tenner: DataTypes.BOOLEAN,
  pending_order: DataTypes.BOOLEAN
}, {
  tableName: 'order_item_details',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = OrderItem;
