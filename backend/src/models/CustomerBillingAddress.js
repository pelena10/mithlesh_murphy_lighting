const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CustomerBillingAddress = sequelize.define('CustomerBillingAddress', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cust_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    billing_address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    billing_city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    billing_district: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    billing_state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    billing_pin_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'customer_billing_addresses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = CustomerBillingAddress;
