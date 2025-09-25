const  FgName  = require('../models/FgName');
const FGNameAttributes = require('../models/FGNameAttributes');
const FgPrice = require('../models/FgPrice');
const sequelize = require('../config/db');
module.exports = {
  // Fetch all records
  async getAll(req, res) {

    try {
      const fgNames = await FgName.findAll();
      res.status(200).json(fgNames);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
async getAllFGNameAttributes(req, res) {
    try {
        const fg_id = req.params.id;
        
        const [results] = await sequelize.query(`
            SELECT a.*, p.value as price 
            FROM fg_name_attributes a 
            LEFT JOIN fg_price p ON a.fg_id = p.fg_names_id 
            WHERE a.fg_id = ?
        `, {
            replacements: [fg_id],
            type: sequelize.QueryTypes.SELECT
        });
        
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},

  // Fetch single record by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const fgName = await FgName.findByPk(id);
      if (!fgName) return res.status(404).json({ error: 'Record not found' });
      res.status(200).json(fgName);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create new record
  async create(req, res) {
    try {
      const { fg_code, fg_name } = req.body;
      const newFgName = await FgName.create({ fg_code, fg_name });
      res.status(201).json(newFgName);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update record by ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const { fg_code, fg_name } = req.body;

      const fgName = await FgName.findByPk(id);
      if (!fgName) return res.status(404).json({ error: 'Record not found' });

      fgName.fg_code = fg_code || fgName.fg_code;
      fgName.fg_name = fg_name || fgName.fg_name;
      await fgName.save();

      res.status(200).json(fgName);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete record by ID
  async delete(req, res) {
    try {
      const { id } = req.params;
      const fgName = await FgName.findByPk(id);
      if (!fgName) return res.status(404).json({ error: 'Record not found' });

      await fgName.destroy();
      res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
