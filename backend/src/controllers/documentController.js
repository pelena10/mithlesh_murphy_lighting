const { Document } = require('../models');

// =======================
// Get all documents
// =======================
exports.getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.findAll();
    res.json(documents);
  } catch (error) {
    next(error);
  }
};

// =======================
// Get document by ID
// =======================
exports.getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });
    res.json(document);
  } catch (error) {
    next(error);
  }
};

// =======================
// Create document
// =======================
exports.createDocument = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Document name required' });

    const document = await Document.create({ name });
    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
};

// =======================
// Update document
// =======================
exports.updateDocument = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Document name required' });

    const document = await Document.findByPk(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    document.name = name;
    await document.save();

    res.json(document);
  } catch (error) {
    next(error);
  }
};

// =======================
// Delete document
// =======================
exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    await document.destroy();
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};
