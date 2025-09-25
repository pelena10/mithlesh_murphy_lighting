const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WorkflowStep = sequelize.define('WorkflowStep', {
  step_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  workflow_template_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

   document_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  step_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assigned_department: {
    type: DataTypes.INTEGER, // FK to Department.id
    allowNull: true,
  },
  assigned_user_id: {
    type: DataTypes.INTEGER, // FK to User.id
    allowNull: true,
  },
  tat: {
    type: DataTypes.INTEGER, // turnaround time in days/hours
    allowNull: true,
  },
  is_auto_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'workflow_steps',
  timestamps: true,          
  createdAt: 'created_at',  
  updatedAt: 'updated_at',   
});

module.exports = WorkflowStep;
