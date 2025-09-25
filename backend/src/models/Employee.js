const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // adjust path to your sequelize instance

const Employee = sequelize.define('Employee', {
  emp_id: {
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
    allowNull: true,
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  registered_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  aadhar_num: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pan_num: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image_aadhar: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  image_pan: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  doj: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  activeYN: {
    type: DataTypes.ENUM('Y', 'N'),
    defaultValue: 'Y',
  },
}, {
  tableName: 'employees',
  timestamps: true,          
  createdAt: 'created_at',  
  updatedAt: 'updated_at',   
});

module.exports = Employee;
