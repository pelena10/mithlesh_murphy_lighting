const {
  Customer,
  CustomerBillingAddress,
  CustomerShippingAddress,
  CustomerContact,
  CustomerBusinessDetail,
  CustomerDocument,
  CustomerAccountDetail,
  Overdues,
  CreditLimits

} = require('../models');
const { FgPrice,
  PriceLists,
  FgName,
  Stores,
  Branches,
  DiscountLists,
  Zone,
  CustomersCategory } = require('../models');

const sequelize = require('../config/db');
const { Op } = require("sequelize");

const customerController = {

  getMasterDataCustomer: async (req, res) => {
    try {
      const [
        fgprice, priceLists, stores,
        branches, discountLists, zone, customersCategory
      ] = await Promise.all([
        FgPrice.findAll(),
        PriceLists.findAll(),
        Stores.findAll(),
        Branches.findAll(),
        DiscountLists.findAll(),
        Zone.findAll(),
        CustomersCategory.findAll()
      ]);

      res.json({ fgprice, priceLists, stores, branches, discountLists, zone, customersCategory });
    } catch (err) {
      console.error("❌ Get Master Data Error:", err);
      res.status(500).json({ message: err.message });
    }
  },
  getCustomers: async (req, res) => {
    try {
      const customers = await Customer.findAll({
        include: [
          { model: CustomerBillingAddress, as: 'billingAddresses' },
          { model: CustomerShippingAddress, as: 'shippingAddresses' },
          { model: CustomerContact, as: 'contact' },
          { model: CustomerBusinessDetail, as: 'businessDetail' },
          { model: CustomerDocument, as: 'documents' },
          { model: CustomerAccountDetail, as: 'accountDetail' }

        ]
      });
      res.json(customers);
    } catch (err) {
      console.error("❌ Get Customers Error:", err);
      res.status(500).json({ message: err.message });
    }
  },
  getCustomersNameList: async (req, res) => {
    try {
      const customers = await Customer.findAll();
      res.json(customers);
    } catch (err) {
      console.error("❌ Get Customers Error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  getCustomerById: async (req, res) => {
    try {
      const customer = await Customer.findByPk(req.params.id, {
        include: [
          { model: CustomerBillingAddress, as: 'billingAddresses' },
          { model: CustomerShippingAddress, as: 'shippingAddresses' },
          { model: CustomerContact, as: 'contact' },
          { model: CustomerBusinessDetail, as: 'businessDetail' },
          { model: CustomerDocument, as: 'documents' },
          { model: CustomerAccountDetail, as: 'accountDetail' },
          { model: Overdues, as: 'overdues' },
          { model: CreditLimits, as: 'creditLimits' }
        ]
      });
      if (!customer) return res.status(404).json({ message: 'Customer not found' });
      res.json(customer);
    } catch (err) {
      console.error("❌ Get Customer Error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  createCustomer: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {

      // Extract main customer data
      const {
        cust_name, gst_no, udyam_reg_no, cust_status, pan, aadhar,
        billingAddresses, shippingAddresses, contact,
        businessDetail, documents, accountDetail
      } = req.body;
      // Create customer
      const customer = await Customer.create({
        cust_name, gst_no, udyam_reg_no, cust_status, pan, aadhar
      }, { transaction });

      // Create related records if they exist
      if (billingAddresses && billingAddresses.length) {
        await CustomerBillingAddress.bulkCreate(
          billingAddresses.map(addr => ({ ...addr, cust_id: customer?.id })),
          { transaction }
        );
      }

      if (shippingAddresses && shippingAddresses.length) {
        await CustomerShippingAddress.bulkCreate(
          shippingAddresses.map(addr => ({ ...addr, cust_id: customer?.id })),
          { transaction }
        );
      }

      if (contact) {
        await CustomerContact.create({ ...contact, cust_id: customer?.id }, { transaction });
      }

      if (businessDetail) {
        await CustomerBusinessDetail.create({ ...businessDetail, cust_id: customer?.id }, { transaction });
      }

      if (documents) {
        await CustomerDocument.create({ ...documents, cust_id: customer?.id }, { transaction });
      }

      if (accountDetail) {
        await CustomerAccountDetail.create({ ...accountDetail, cust_id: customer?.id }, { transaction });
      }

      await transaction.commit();

      // Fetch the complete customer with all relations
      const newCustomer = await Customer.findByPk(customer?.id, {
        include: [
          { model: CustomerBillingAddress, as: 'billingAddresses' },
          { model: CustomerShippingAddress, as: 'shippingAddresses' },
          { model: CustomerContact, as: 'contact' },
          { model: CustomerBusinessDetail, as: 'businessDetail' },
          { model: CustomerDocument, as: 'documents' },
          { model: CustomerAccountDetail, as: 'accountDetail' }
        ]
      });

      res.status(201).json(newCustomer);

    } catch (err) {
      await transaction.rollback();
      console.error("❌ Create Customer Error:", err);
      res.status(500).json({ message: err.message, stack: err.stack });
    }
  },



  updateCustomer: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const customerId = req.params.id;

      const customer = await Customer.findByPk(customerId, { transaction });
      if (!customer) {
        await transaction.rollback();
        return res.status(404).json({ message: "Customer not found" });
      }

      const {
        cust_name, gst_no, udyam_reg_no, cust_status, pan, aadhar,
        billingAddresses, shippingAddresses, contact,
        businessDetail, documents, accountDetail
      } = req.body;

      // ✅ Check PAN uniqueness excluding this customer
      if (pan) {
        const panExists = await Customer.findOne({
          where: {
            pan,
            id: { [Op.ne]: customerId }   // 🔑 exclude current customer
          }
        });
        if (panExists) {
          await transaction.rollback();
          return res.status(400).json({ message: "PAN number already exists" });
        }
      }

      // ✅ Check Aadhaar uniqueness excluding this customer
      if (aadhar) {
        const aadharExists = await Customer.findOne({
          where: {
            aadhar,
            id: { [Op.ne]: customerId }   // 🔑 exclude current customer
          }
        });
        if (aadharExists) {
          await transaction.rollback();
          return res.status(400).json({ message: "Aadhaar number already exists" });
        }
      }

      // ---- Update main record ----
      await customer.update(
        { cust_name, gst_no, udyam_reg_no, cust_status, pan, aadhar },
        { transaction }
      );

      // ---- Update related tables (unchanged) ----
      await CustomerBillingAddress.destroy({ where: { cust_id: customerId }, transaction });
      if (billingAddresses?.length) {
        await CustomerBillingAddress.bulkCreate(
          billingAddresses.map(addr => ({ ...addr, cust_id: customerId })),
          { transaction }
        );
      }

      await CustomerShippingAddress.destroy({ where: { cust_id: customerId }, transaction });
      if (shippingAddresses?.length) {
        await CustomerShippingAddress.bulkCreate(
          shippingAddresses.map(addr => ({ ...addr, cust_id: customerId })),
          { transaction }
        );
      }

      await CustomerContact.destroy({ where: { cust_id: customerId }, transaction });
      if (contact) {
        await CustomerContact.create({ ...contact, cust_id: customerId }, { transaction });
      }

      await CustomerBusinessDetail.destroy({ where: { cust_id: customerId }, transaction });
      if (businessDetail) {
        await CustomerBusinessDetail.create({ ...businessDetail, cust_id: customerId }, { transaction });
      }

      await CustomerDocument.destroy({ where: { cust_id: customerId }, transaction });
      if (documents) {
        await CustomerDocument.create({ ...documents, cust_id: customerId }, { transaction });
      }

      await CustomerAccountDetail.destroy({ where: { cust_id: customerId }, transaction });
      if (accountDetail) {
        await CustomerAccountDetail.create({ ...accountDetail, cust_id: customerId }, { transaction });
      }

      await transaction.commit();

      const updatedCustomer = await Customer.findByPk(customerId, {
        include: [
          { model: CustomerBillingAddress, as: "billingAddresses" },
          { model: CustomerShippingAddress, as: "shippingAddresses" },
          { model: CustomerContact, as: "contact" },
          { model: CustomerBusinessDetail, as: "businessDetail" },
          { model: CustomerDocument, as: "documents" },
          { model: CustomerAccountDetail, as: "accountDetail" }
        ]
      });

      res.json({ message: "Customer updated successfully", updatedCustomer });
    } catch (err) {
      await transaction.rollback();
      console.error("❌ Update Customer Error:", err);
      res.status(500).json({ message: err.message });
    }
  },


  deleteCustomer: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const customerId = req.params.id;

      // Delete all related records first
      await Promise.all([
        CustomerBillingAddress.destroy({ where: { cust_id: customerId }, transaction }),
        CustomerShippingAddress.destroy({ where: { cust_id: customerId }, transaction }),
        CustomerContact.destroy({ where: { cust_id: customerId }, transaction }),
        CustomerBusinessDetail.destroy({ where: { cust_id: customerId }, transaction }),
        CustomerDocument.destroy({ where: { cust_id: customerId }, transaction }),
        CustomerAccountDetail.destroy({ where: { cust_id: customerId }, transaction })
      ]);

      // Delete the customer
      const deleted = await Customer.destroy({
        where: { id: customerId },
        transaction
      });

      if (!deleted) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Customer not found' });
      }

      await transaction.commit();
      res.json({ message: 'Customer deleted' });
    } catch (err) {
      await transaction.rollback();
      console.error("❌ Delete Customer Error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  // Document upload handler
  uploadDocuments: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const customerId = req.params.id;
      const files = req.files;

      // Check if customer exists
      const customer = await Customer.findByPk(customerId, { transaction });
      if (!customer) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Customer not found' });
      }

      // Get existing documents or create new entry
      let documents = await CustomerDocument.findOne({
        where: { cust_id: customerId },
        transaction
      });

      const documentData = {};

      // Map uploaded files to document fields
      if (files) {
        Object.keys(files).forEach(fieldName => {
          const file = files[fieldName][0];
          documentData[fieldName] = file.path;
        });
      }

      if (documents) {
        // Update existing document record
        await documents.update(documentData, { transaction });
      } else {
        // Create new document record
        documentData.cust_id = customerId;
        await CustomerDocument.create(documentData, { transaction });
      }

      await transaction.commit();

      // Fetch updated documents
      const updatedDocuments = await CustomerDocument.findOne({
        where: { cust_id: customerId }
      });

      res.json(updatedDocuments);
    } catch (err) {
      await transaction.rollback();
      console.error("❌ Upload Documents Error:", err);
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = { customerController };