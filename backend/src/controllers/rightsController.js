const { Rights } = require('../models');

// =======================
// Get all rights
// =======================
exports.getRights = async (req, res, next) => {
  try {
    const rights = await Rights.findAll();
    console.log(rights);
    res.json(rights);
  } catch (err) {
    next(err);
  }
};

// =======================
// Get right by ID
// =======================
exports.getRightsById = async (req, res, next) => {
  try {
    const right = await Rights.findByPk(req.params.id);
    if (!right) return res.status(404).json({ message: 'Right not found' });
    res.json(right);
  } catch (err) {
    next(err);
  }
};

// =======================
// Create new right
// =======================
exports.createRights = async (req, res, next) => {
  try {
    const { name, dep_id } = req.body;
    if (!name) return res.status(400).json({ message: 'Right name required' });

    // Check for unique right name
    const existing = await Rights.findOne({ where: { name } });
    if (existing) return res.status(400).json({ message: 'Right name already exists' });

    const right = await Rights.create({ name, dep_id: dep_id || null });
    res.status(201).json(right);
  } catch (err) {
    next(err);
  }
};

// =======================
// Update right
// =======================
exports.updateRights = async (req, res, next) => {
  try {
    const { name, dep_id } = req.body;
    const right = await Rights.findByPk(req.params.id);
    if (!right) return res.status(404).json({ message: 'Right not found' });

    // Check for unique name excluding current record
    if (name) {
      const existing = await Rights.findOne({ where: { name } });
      if (existing && existing.id !== right.id) {
        return res.status(400).json({ message: 'Right name already exists' });
      }
      right.name = name;
    }

    if (dep_id !== undefined) right.dep_id = dep_id;

    await right.save();
    res.json(right);
  } catch (err) {
    next(err);
  }
};

// =======================
// Delete right
// =======================
exports.deleteRights = async (req, res, next) => {
  try {
    const right = await Rights.findByPk(req.params.id);
    if (!right) return res.status(404).json({ message: 'Right not found' });

    await right.destroy();
    res.json({ message: 'Right deleted successfully' });
  } catch (err) {
    next(err);
  }
};
