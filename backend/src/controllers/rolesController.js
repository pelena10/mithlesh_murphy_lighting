const { Role } = require('../models');

// =======================
// Get all roles
// =======================
exports.getRoles = async (req, res, next) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (err) {
    next(err);
  }
};

// =======================
// Get role by ID
// =======================
exports.getRolesById = async (req, res, next) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (err) {
    next(err);
  }
};

// =======================
// Create a new role
// =======================
exports.createRoles = async (req, res, next) => {
  try {
    const { name, dep_id } = req.body;
    if (!name) return res.status(400).json({ message: 'Role name required' });

    // Check for unique role name
    const existing = await Role.findOne({ where: { name } });
    if (existing) return res.status(400).json({ message: 'Role name already exists' });

    const role = await Role.create({ name, dep_id: dep_id || null });
    res.status(201).json(role);
  } catch (err) {
    next(err);
  }
};

// =======================
// Update role
// =======================
exports.updateRoles = async (req, res, next) => {
  try {
    const { name, dep_id } = req.body;
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });

    // Check for unique name excluding current record
    if (name) {
      const existing = await Role.findOne({ where: { name } });
      if (existing && existing.id !== role.id) {
        return res.status(400).json({ message: 'Role name already exists' });
      }
      role.name = name;
    }

    if (dep_id !== undefined) role.dep_id = dep_id;

    await role.save();
    res.json(role);
  } catch (err) {
    next(err);
  }
};

// =======================
// Delete role
// =======================
exports.deleteRoles = async (req, res, next) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });

    await role.destroy();
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    next(err);
  }
};
