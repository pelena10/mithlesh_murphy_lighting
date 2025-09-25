const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CustomerContact = sequelize.define('CustomerContact', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cust_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  register_mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  register_email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  contact_person1_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_person1_mobile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_person1_email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isEmail: true },
  },
  contact_person1_dob: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  contact_person1_anniversary: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  contact_person2_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_person2_mobile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_person2_email: {
    type: DataTypes.STRING,
    allowNull: true,
    // validate: { isEmail: true }, // bcz it is optional
  },
  contact_person2_dob: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  contact_person2_anniversary: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  contact_person3_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_person3_mobile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_person3_email: {
    type: DataTypes.STRING,
    allowNull: true,
    // validate: { isEmail: true }, // bcz it is optional
  },
  contact_person3_dob: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  contact_person3_anniversary: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'customer_contacts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = CustomerContact;
