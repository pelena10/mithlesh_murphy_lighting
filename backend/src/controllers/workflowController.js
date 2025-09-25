const { WorkflowTemplate, Document } = require('../models');

// =======================
// Get all workflow templates
// =======================
exports.getWorkflows = async (req, res, next) => {
  try {
    const workflows = await WorkflowTemplate.findAll({
      include: [{ model: Document, as: 'document' }],
    });
    res.json({ success: true, data: workflows });
  } catch (err) {
    console.error('Error fetching workflows:', err);
    next(err);
  }
};

// =======================
// Get a workflow template by ID
// =======================
exports.getWorkflowById = async (req, res, next) => {
  try {
    const workflow = await WorkflowTemplate.findByPk(req.params.id, {
      include: [{ model: Document, as: 'document' }],
    });
    if (!workflow) {
      return res.status(404).json({ success: false, message: 'Workflow template not found' });
    }
    res.json({ success: true, data: workflow });
  } catch (err) {
    console.error('Error fetching workflow:', err);
    next(err);
  }
};

// =======================
// Create a new workflow template
// =======================
exports.createWorkflow = async (req, res, next) => {
  try {
    const { name, tat, document_id, status } = req.body;

    if (!name || !tat || !document_id) {
      return res.status(400).json({ message: 'Name, TAT, and Document ID are required' });
    }

    const workflowStatus = status || 'Active';

    // Check if document exists
    const document = await Document.findByPk(document_id);
    if (!document) {
      return res.status(400).json({ message: 'Document not found' });
    }

    const workflow = await WorkflowTemplate.create({
      name,
      tat,
      document_id,
      status: workflowStatus,
    });

    res.status(201).json({ success: true, data: workflow });
  } catch (err) {
    console.error('Error creating workflow:', err);
    next(err);
  }
};

// =======================
// Update a workflow template
// =======================
exports.updateWorkflow = async (req, res, next) => {
  try {
    const { name, tat, document_id, status } = req.body;

    if (!tat || !document_id || !status) {
      return res.status(400).json({ message: 'TAT, Document ID, and Status are required' });
    }

    const workflow = await WorkflowTemplate.findByPk(req.params.id);
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow template not found' });
    }

    // Prevent changing the workflow name
    if (name && name !== workflow.name) {
      return res.status(400).json({ message: 'Workflow name cannot be changed' });
    }

    workflow.tat = tat;
    workflow.document_id = document_id;
    workflow.status = status;

    await workflow.save();

    res.json({ success: true, data: workflow });
  } catch (err) {
    console.error('Error updating workflow:', err);
    next(err);
  }
};

// =======================
// Delete a workflow template
// =======================
exports.deleteWorkflow = async (req, res, next) => {
  try {
    const workflow = await WorkflowTemplate.findByPk(req.params.id);
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow template not found' });
    }

    await workflow.destroy();
    res.json({ success: true, message: 'Workflow template deleted successfully' });
  } catch (err) {
    console.error('Error deleting workflow:', err);
    next(err);
  }
};
