const { Employee, User,sequelize } = require('../models');
const { generateUserId } = require('../utils/autogenerate');
const bcrypt = require('bcrypt');

const employeeController = {
  // =======================
  // Get all employees
  // =======================
  getEmployees: async (req, res, next) => {
    try {
      const employees = await Employee.findAll();
      res.json(employees);
    } catch (err) {
      next(err);
    }
  },

  // =======================
  // Get employee by ID
  // =======================
  getEmployeeById: async (req, res, next) => {
    try {
      const employee = await Employee.findByPk(req.params.id);
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
      res.json(employee);
    } catch (err) {
      next(err);
    }
  },

  // =======================
  // Create employee
  // =======================
  // createEmployee: async (req, res, next) => {
  //   try {
  //     const data = req.body || {};
  //     data.user_id = generateUserId();

  //     // Handle file uploads
  //     if (req.files) {
  //       if (req.files.image_aadhar) data.image_aadhar = req.files.image_aadhar[0].path.replace(/\\/g, '/');
  //       if (req.files.image_pan) data.image_pan = req.files.image_pan[0].path.replace(/\\/g, '/');
  //     }

  //     // Check duplicate email
  //     if (data.registered_email) {
  //       const existing = await Employee.findOne({ where: { registered_email: data.registered_email } });
  //       if (existing) return res.status(400).json({ message: 'Email already exists' });
  //     }

  //     const employee = await Employee.create(data);
  //     res.status(201).json(employee);
  //   } catch (err) {
  //     console.log(err)
  //     next(err);
  //   }
  // },

  createEmployee: async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body || {};

      // Handle file uploads
      if (req.files) {
        if (req.files.image_aadhar) {
          data.image_aadhar = req.files.image_aadhar[0].path.replace(/\\/g, '/');
        }
        if (req.files.image_pan) {
          data.image_pan = req.files.image_pan[0].path.replace(/\\/g, '/');
        }
      }

      // Check duplicate email
      if (data.registered_email) {
        const existing = await Employee.findOne({
          where: { registered_email: data.registered_email }
        });
        if (existing) {
          await transaction.rollback();
          return res.status(400).json({ message: 'Email already exists' });
        }
      }

      // 1️⃣ Generate UUID using your helper
      const userId = generateUserId();
      console.log("userId", userId)
      data.user_id = userId;
      const defaultPassword = "Murphy@1972";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      // 2️⃣ Create User with that ID
      const user = await User.create({
        id: userId,
        name: data.name,
        email: data.registered_email,
        mobile: data.phone_number,
        role_id: data.role_id,
        password: hashedPassword,
      }, { transaction });

      // 3️⃣ Create Employee referencing the same ID
      const employee = await Employee.create(data, { transaction });

      await transaction.commit();
      res.status(201).json({ user, employee });

    } catch (err) {
      await transaction.rollback();
      console.log(err);
      next(err);
    }
  },


  // =======================
  // Update employee
  // =======================
  updateEmployee: async (req, res, next) => {
    try {
      const allowedFields = [
        'user_id', 'name', 'dep_id', 'designation', 'role_id',
        'registered_email', 'phone_number', 'address',
        'aadhar_num', 'pan_num', 'image_aadhar', 'image_pan',
        'dob', 'doj', 'activeYN'
      ];

      const employee = await Employee.findByPk(req.params.id);
      if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

      // Build sanitized update data
      const data = {};
      for (const key of allowedFields) {
        if (req.body[key] !== undefined && req.body[key] !== 'u') {
          data[key] = req.body[key];
        }
      }

      // Handle file uploads
      if (req.files) {
        if (req.files.image_aadhar && req.files.image_aadhar[0]) {
          data.image_aadhar = req.files.image_aadhar[0].path.replace(/\\/g, '/');
        }
        if (req.files.image_pan && req.files.image_pan[0]) {
          data.image_pan = req.files.image_pan[0].path.replace(/\\/g, '/');
        }
      }

      if (Object.keys(data).length === 0) {
        return res.status(400).json({ success: false, message: 'No valid fields to update' });
      }

      await employee.update(data);
      res.json({ success: true, data: employee });
    } catch (err) {
      next(err);
    }
  },

  // =======================
  // Delete employee
  // =======================
  deleteEmployee: async (req, res, next) => {
    try {
      const employee = await Employee.findByPk(req.params.id);
      if (!employee) return res.status(404).json({ message: 'Employee not found' });

      await employee.destroy();
      res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  // =======================
  // Soft delete / deactivate
  // =======================
  deactivateEmployee: async (req, res, next) => {
    try {
      const employee = await Employee.findByPk(req.params.id);
      if (!employee) return res.status(404).json({ message: 'Employee not found' });

      await employee.update({ activeYN: 'N' });
      res.json({ message: 'Employee deactivated' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = employeeController;
