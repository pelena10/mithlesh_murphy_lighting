const { Role, Rights } = require('../models');

// =======================
// Get all Role-Rights associations
// =======================
exports.getRoleRights = async (req, res, next) => {
  try {
    // Include associated Rights for each Role
    const roles = await Role.findAll({
      include: {
        model: Rights,
        as: 'rights', // as defined in associations
        through: { attributes: [] }, // remove RoleRight join table attributes
      },
    });
    res.json(roles);
  } catch (err) {
    next(err);
  }
};

// =======================
// Get rights by Role ID
// =======================
exports.getRightsByRole = async (req, res, next) => {
  try {
    const roleId = parseInt(req.params.roleId);
    const role = await Role.findByPk(roleId, {
      include: {
        model: Rights,
        as: 'rights',
        through: { attributes: [] },
      },
    });

    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role.rights);
  } catch (err) {
    next(err);
  }
};

// =======================
// Assign rights to a role
// =======================
exports.assignRights = async (req, res, next) => {
  try {
    const { roleId, rights } = req.body; // rights = [1, 2, 3]
    if (!roleId || !Array.isArray(rights)) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const role = await Role.findByPk(roleId);
    if (!role) return res.status(404).json({ message: 'Role not found' });

    // Set the many-to-many association
    await role.setRights(rights); // automatically handles RoleRight join table
    const updatedRole = await Role.findByPk(roleId, {
      include: {
        model: Rights,
        as: 'rights',
        through: { attributes: [] },
      },
    });

    res.json(updatedRole.rights);
  } catch (err) {
    next(err);
  }
};
