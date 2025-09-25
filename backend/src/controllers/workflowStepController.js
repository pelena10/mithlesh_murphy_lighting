const { WorkflowStep, WorkflowTemplate, User, Department } = require('../models');

// =======================
// Get all workflow steps
// =======================
exports.getAllWorkflowSteps = async (req, res, next) => {
  try {
    const steps = await WorkflowStep.findAll({
      include: [
        { model: WorkflowTemplate, as: 'workflowTemplate' },
        { model: Department, as: 'assignedDepartment' },
        { model: User, as: 'assignedUser' },
      ],
      order: [['workflow_template_id', 'ASC'], ['step_number', 'ASC']],
    });

    res.json({ success: true, data: steps });
  } catch (err) {
    console.error('Error fetching workflow steps:', err);
    next(err);
  }
};

// =======================
// Get workflow step by ID
// =======================
exports.getWorkflowStepById = async (req, res, next) => {
  try {
    const step = await WorkflowStep.findByPk(req.params.id, {
      include: [
        { model: WorkflowTemplate, as: 'workflowTemplate' },
        { model: Department, as: 'assignedDepartment' },
        { model: User, as: 'assignedUser' },
      ],
    });

    if (!step) return res.status(404).json({ success: false, message: 'Workflow step not found' });
    res.json({ success: true, data: step });
  } catch (err) {
    console.error('Error fetching workflow step:', err);
    next(err);
  }
};

// =======================
// Create workflow step
// Supports append (default) or renumber insertion
// =======================
exports.createWorkflowStep = async (req, res, next) => {
  const { workflow_template_id, step_number, name, assigned_department, assigned_user_id, tat, is_auto_approved, stepAction } = req.body;

  if (!workflow_template_id || !step_number || !name) {
    return res.status(400).json({ success: false, message: 'Workflow, step number, and name are required' });
  }

  try {
    let newStepNumber = parseInt(step_number);

    if (stepAction === 'renumber') {
      // Shift steps down for renumbering
      await WorkflowStep.increment(
        { step_number: 1 },
        { where: { workflow_template_id, step_number: { [Op.gte]: newStepNumber } } }
      );
    } else {
      // Append to the end
      const maxStep = await WorkflowStep.max('step_number', { where: { workflow_template_id } }) || 0;
      newStepNumber = maxStep + 1;
    }

    const step = await WorkflowStep.create({
      workflow_template_id,
      step_number: newStepNumber,
      name,
      assigned_department,
      assigned_user_id,
      tat,
      is_auto_approved,
    });

    res.status(201).json({ success: true, message: 'Workflow step created successfully', data: step });
  } catch (err) {
    console.error('Error creating workflow step:', err);
    next(err);
  }
};

// =======================
// Update workflow step
// Supports renumbering
// =======================
exports.updateWorkflowStep = async (req, res, next) => {
  const { id } = req.params;
  const { workflow_template_id, step_number, name, assigned_department, assigned_user_id, tat, is_auto_approved, stepAction } = req.body;

  if (!workflow_template_id || !step_number || !name) {
    return res.status(400).json({ success: false, message: 'Workflow, step number, and name are required' });
  }

  try {
    const step = await WorkflowStep.findByPk(id);
    if (!step) return res.status(404).json({ success: false, message: 'Workflow step not found' });

    const newStepNumber = parseInt(step_number);
    const oldStepNumber = step.step_number;

    if (stepAction === 'renumber' && newStepNumber !== oldStepNumber) {
      if (newStepNumber < oldStepNumber) {
        await WorkflowStep.increment(
          { step_number: 1 },
          { where: { workflow_template_id, step_number: { [Op.gte]: newStepNumber, [Op.lt]: oldStepNumber } } }
        );
      } else {
        await WorkflowStep.decrement(
          { step_number: 1 },
          { where: { workflow_template_id, step_number: { [Op.lte]: newStepNumber, [Op.gt]: oldStepNumber } } }
        );
      }
      step.step_number = newStepNumber;
    }

    step.name = name;
    step.assigned_department = assigned_department;
    step.assigned_user_id = assigned_user_id;
    step.tat = tat;
    step.is_auto_approved = is_auto_approved;

    await step.save();

    res.json({ success: true, message: 'Workflow step updated successfully', data: step });
  } catch (err) {
    console.error('Error updating workflow step:', err);
    next(err);
  }
};

// =======================
// Delete workflow step and renumber
// =======================
exports.deleteWorkflowStep = async (req, res, next) => {
  try {
    const step = await WorkflowStep.findByPk(req.params.id);
    if (!step) return res.status(404).json({ success: false, message: 'Workflow step not found' });

    const workflow_template_id = step.workflow_template_id;
    const deletedStepNumber = step.step_number;

    await step.destroy();

    // Renumber remaining steps
    await WorkflowStep.decrement(
      { step_number: 1 },
      { where: { workflow_template_id, step_number: { [Op.gt]: deletedStepNumber } } }
    );

    res.json({ success: true, message: 'Workflow step deleted and remaining steps renumbered' });
  } catch (err) {
    console.error('Error deleting workflow step:', err);
    next(err);
  }
};
