// const { Brand } = require('../models/Brand');
const { Brand } = require('../models'); 

exports.createBrand = async (req, res) => {
  try {
    const { description, short_name } = req.body;

    if (!description || !short_name) {
      return res.status(400).json({ error: 'Description and Short Name are required' });
    }
 
    const brand = await Brand.create({ description, short_name });
    return res.status(201).json(brand);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create brand' });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({ order: [['id', 'ASC']] });
    return res.json(brands);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch brands' });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByPk(id);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    return res.json(brand);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch brand' });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, short_name } = req.body;

    const brand = await Brand.findByPk(id);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    brand.description = description || brand.description;
    brand.short_name = short_name || brand.short_name;
    await brand.save();

    return res.json(brand);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update brand' });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByPk(id);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    await brand.destroy();
    return res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete brand' });
  }
};
