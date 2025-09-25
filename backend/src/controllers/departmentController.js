const { Department } = require('../models');

// =======================
// Get all Departments
// =======================
exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (error) {
    next(error);
  }
};

// =======================
// Get Department by ID
// =======================
exports.getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: 'Not found' });
    res.json(department);
  } catch (error) {
    next(error);
  }
};

// =======================
// Create Department
// =======================
exports.createDepartment = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Department name required' });

    const department = await Department.create({ name, description });
    res.status(201).json(department);
  } catch (error) {
    next(error);
  }
};

// =======================
// Update Department
// =======================
exports.updateDepartment = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: 'Not found' });

    department.name = name || department.name;
    department.description = description !== undefined ? description : department.description;
    await department.save();

    res.json(department);
  } catch (error) {
    next(error);
  }
};

// =======================
// Delete Department
// =======================
exports.deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: 'Not found' });

    await department.destroy();
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    next(error);
  }
};
