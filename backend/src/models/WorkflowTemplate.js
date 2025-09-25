const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WorkflowTemplate = sequelize.define('WorkflowTemplate', {
  workflow_template_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  tat: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  document_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active',
  },
}, {
  tableName: 'workflow_templates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = WorkflowTemplate;
