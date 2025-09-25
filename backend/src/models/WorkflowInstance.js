const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WorkflowInstance = sequelize.define('WorkflowInstance', {
  workflow_instance_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
   order_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  workflow_template_id: {
    type: DataTypes.INTEGER, 
    allowNull: false
  },
    document_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  document_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  document_type: {
    type: DataTypes.STRING, // Consider ENUM if fixed types
    allowNull: false
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Completed', 'Aborted', 'Cancelled'),
    defaultValue: 'Pending'
  },
  classification: {
    type: DataTypes.ENUM('On time', 'Delayed', 'Too Much Delayed'),
    allowNull: true
  }
}, {
  tableName: 'workflow_instance',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = WorkflowInstance;
