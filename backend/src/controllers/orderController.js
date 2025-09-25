const { OrderItem, PendingOrderItem, Order, Document, CreditLimits, DeliveryNotes, DeliveryNotesDetails, WorkflowTemplate, WorkflowStep, WorkflowInstance } = require('../models');
const sequelize = require('../config/db');
const orderController = {
  // 📦 GET all orders where order_status = 'Pending'
  getPendingOrders: async (req, res) => {
    try {

      const pendingOrders = await Order.findAll({
        where: { order_status: "Pending" },
        // order: [["createdAt", "DESC"]],
      });

      res.json(pendingOrders);
    } catch (err) {
      console.error("❌ Get Pending Orders Error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  // 📦 GET orders where order_status = 'Pending' Items And Particular Customer
  getPendingOrderItems: async (req, res) => {
    const cust_id = req.params.id
    try {
      const pendingOrders = await PendingOrderItem.findAll({
        where: { status: "Pending", cust_id },
      });
      res.json(pendingOrders);
    } catch (err) {
      console.error("❌ Get Pending Orders Error:", err);
      res.status(500).json({ message: err.message });
    }
  },
  getTotalCustPendingOrders: async (req, res) => {
    const cust_id = req.params.id
    try {
      const pendingOrders = await Order.findAll({
        where: { order_status: "Pending", cust_id },
      });
      res.json(pendingOrders.length);
    } catch (err) {
      console.error("❌ Get Pending Orders Error:", err);
      res.status(500).json({ message: err.message });
    }
  },
  createOrder: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const {
        customerId,
        order_date,
        orderType,
        totalItems,
        totalQuantity,
        totalAmount,
        gstAmount,
        grandTotal,
        expected_delivery_date,
        notes,
        items,
        cashDiscount
      } = req.body;

      if (!customerId) {
        return res.status(400).json({ message: "Missing required field: customerId" });
      }
      const document = await Document.findAll({
        where: { name: "ORD" }
      });
      const creditLimits = await CreditLimits.findAll({
        where: { cust_id: customerId }
      });
      if (document.length === 0) {
        throw new Error('No document found for document_id: ORD');
      }
      // if (creditLimits.length === 0) {
      //   throw new Error('No CreditLimits found for Customer');
      // }
      // Calculate order totals
      const { discount_amount, tax_amount } = calculateOrderTotals(items, cashDiscount);

      // Create order
      const order = await createOrderRecord({
        customerId,
        quantity: totalQuantity,

        order_date,
        expected_delivery_date,
        notes,
        total_amount: totalAmount,
        discount_amount,
        tax_amount,
        grand_total: grandTotal,
        document_id: document[0].id
      }, transaction);

      // Update temp order items
      await updateOrderItems(order.id, items, transaction);

      // Create workflow

      const workflowResult = await createWorkflow(order.id, document[0].id, grandTotal, order, orderType, creditLimits[0]?.credit_limit, items, transaction);

      // Commit transaction
      await transaction.commit();

      res.status(201).json({
        order: {
          ...order.toJSON(),
          workflow_instance_id: workflowResult.workflowInstanceId
        },
        workflow: workflowResult,
        message: "Order created successfully!"
      });

    } catch (err) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error("❌ Create Order Error:", err);
      res.status(500).json({ message: err.message, stack: err.stack });
    }
  },

  //===========================
  //  temp item
  //===========================
  // ✅ CREATE temp item
  addOrderItem: async (req, res) => {
    try {
      const {
        name,
        productId,
        customerId,
        quantity,
        dp,
        discount,
        projectDiscount,
        amount,
        hoFgStore,
        ptFgStore,
        hoRndo,
        inFgStore,
        jbFgStore,
        master,
        tenner,
        pendingOrder
      } = req.body;

      const newItem = await OrderItem.create({
        product_id: productId,
        cust_id: customerId,
        product_name: name,
        quantity,
        approved_quantity: quantity,
        approved_rate: amount,
        dp,
        discount,
        project_discount: projectDiscount,
        amount,
        ho_fg_store: hoFgStore,
        pt_fg_store: ptFgStore,
        ho_rndo: hoRndo,
        in_fg_store: inFgStore,
        jb_fg_store: jbFgStore,
        master,
        tenner,
        pending_order: pendingOrder
      });
      res.status(201).json(newItem);
    } catch (err) {
      console.error("❌ Add Temp Item Error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  // 📖 GET all items for a session
  getOrderItemsAll: async (req, res) => {
    const cust_id = req.params.cust_id;

    try {
      if (!cust_id) return res.status(400).json({ message: 'Missing required field: cust_id' });
      const items = await OrderItem.findAll({
        where: {
          Order_Id: null,
          cust_id
        }
      });
      res.json(items);
    } catch (err) {
      console.error("❌ Get Temp Items Error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  // ✏️ UPDATE temp item by ID
  updateOrderItem: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body.updatedData;
      const item = await OrderItem.findByPk(id);
      if (!item) return res.status(404).json({ message: 'Temp item not found' });
      await item.update(updatedData);

      console.log("updatedData", updatedData)
      res.json(item);
    } catch (err) {
      console.error("❌ Update Temp Item Error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  // ❌ DELETE temp item by ID
  deleteOrderItem: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await OrderItem.destroy({ where: { id } });

      if (!deleted) return res.status(404).json({ message: 'Temp item not found' });

      res.json({ message: 'Temp item deleted successfully' });
    } catch (err) {
      console.error("❌ Delete Temp Item Error:", err);
      res.status(500).json({ message: err.message });
    }
  },


};

//========================
//////WORKFLOW TRIGGER////
/////Helper functions////
//========================
const calculateOrderTotals = (items, cashDiscount) => {
  let total_amount = 0;
  let discount_amount = 0;
  let tax_amount = 0;

  items.forEach(item => {
    const itemAmount = item.amount;
    total_amount += itemAmount;
    const dp_total = item.dp * item.quantity;
    const item_discount = dp_total - itemAmount;
    discount_amount += item_discount;
  });

  if (cashDiscount) {
    const cash_discount_value = total_amount * 0.01;
    discount_amount += cash_discount_value;
  }

  return { discount_amount, tax_amount };
};

const createOrderRecord = async (orderData, transaction) => {
  const {
    customerId,
    order_date,
    expected_delivery_date,
    notes,
    total_amount,
    discount_amount,
    tax_amount,
    grand_total,
    document_id,
  } = orderData;

  const order = await Order.create({
    cust_id: customerId,
    order_date: order_date || new Date(),
    expected_delivery_date: expected_delivery_date || new Date(),
    total_amount,
    discount_amount: 0,
    workflow_instance_id: null,
    tax_amount,
    grand_total,
    document_id: document_id || null,
    notes: notes || null
  }, { transaction });

  await order.update({
    order_number: `ORD${order.id}`
  }, { transaction });

  return order;
};

const updateOrderItems = async (orderId, items, transaction) => {
  if (!items || items.length === 0) return;

  try {
    // Create pending order items
    const pendingOrderItemsData = items.map(item => ({
      cust_id: item.cust_id,
      order_id: orderId,
      item_id: item.product_id,
      order_qty: item.quantity || 0,
      dispatch_qty: 0,
      dp: 0,
      discount: item.discount || 0,
      amount: item.amount || '0',
      pendingqty: item.quantity || 0,
      status: 'Pending'
    }));

    await PendingOrderItem.bulkCreate(pendingOrderItemsData, { transaction });

    // If you need to update each OrderItem with specific values from items:
    const updatePromises = items.map(item =>
      OrderItem.update(
        {
          Order_Id: orderId,
        },
        {
          where: { id: item.id },
          transaction
        }
      )
    );

    await Promise.all(updatePromises);

  } catch (error) {
    console.error('Error updating order items:', error);
    throw error;
  }
};

const createWorkflow = async (orderId, document_id, grandTotal, order, orderType, credit_limit, items, transaction) => {

  try {
    const workflowTemplates = await WorkflowTemplate.findAll({
      where: { document_id: document_id },
      attributes: ['workflow_template_id', 'document_id']
    });

    if (workflowTemplates.length === 0) {
      throw new Error('No workflow template found for document_id: ORD');
    }

    const workflowTemplate = workflowTemplates[0];
    let workflowStep = [];

    if (workflowTemplate) {
      workflowStep = await WorkflowStep.findAll({
        where: { workflow_template_id: workflowTemplate.workflow_template_id },
        order: [['step_number', 'ASC']]
      });
    }

    const CREDIT_LIMIT = credit_limit || 0;
    const OUTSTANDING = 7000;
    const workflowInstanceId = `WID${Math.floor(100000 + Math.random() * 900000)}`;

    const workflowInstances = [];
    let currentStatus = 'Pending';

    for (const step of workflowStep) {
      const isFirstStep = step.step_number === 1;
      const isAutoApproved = step.is_auto_approved;
      let shouldAutoApprove = isAutoApproved;
      let stepStatus = 'Pending';
      let endTime = null;
      let classification = null;
      let durationMinutes = null;
      const startTime = new Date();
      if (isFirstStep) {
        // Apply credit limit validation rules
        if (CREDIT_LIMIT > OUTSTANDING && orderType == 'regular') {
          if (grandTotal > OUTSTANDING ) {
            // Condition 1: credit limit > outstanding AND total grand > outstanding → Should NOT auto-approve
            shouldAutoApprove = false;
            console.log('Credit condition 1 met: Grand Total > Outstanding - Manual Approval Required');
          } else if (grandTotal <= OUTSTANDING ) {
            // Condition 2: credit limit > outstanding AND total grand <= outstanding → Can auto-approve
            shouldAutoApprove = isAutoApproved; // Respect the template setting
            console.log('Credit condition 2 met: Grand Total <= Outstanding - Can Auto Approve');
          }
        } else {
          // If credit limit <= outstanding, always require manual approval for first step
          shouldAutoApprove = false;
          console.log('Credit limit <= Outstanding - Manual Approval Required');
        }
        stepStatus = shouldAutoApprove ? 'Completed' : 'Pending';
        endTime = shouldAutoApprove ? new Date() : null;
        classification = shouldAutoApprove ? 'On time' : null;
        currentStatus = stepStatus;
        if (shouldAutoApprove) {
          durationMinutes = Math.round((endTime - startTime) / (1000 * 60));
        }
      } else {
        // For subsequent steps, check if previous step was completed
        const previousStep = workflowStep.find(s => s.step_number === step.step_number - 1);
        const previousInstance = workflowInstances.find(inst => inst.step_id === previousStep.step_id);
        if (previousInstance && previousInstance.status === 'Completed') {
          // Previous step completed, check if current step should auto-approve
          stepStatus = shouldAutoApprove ? 'Completed' : 'Pending';
          endTime = shouldAutoApprove ? new Date() : null;
          currentStatus = stepStatus;
          if (shouldAutoApprove) {
            durationMinutes = Math.round((endTime - startTime) / (1000 * 60));
            classification = 'On time';
          }
        } else {
          // Previous step not completed, this step remains pending
          stepStatus = 'Pending';
        }
      }

      const workflowInstance = await WorkflowInstance.create({
        workflow_template_id: step.workflow_template_id,
        step_id: step.step_id,
        order_id: `ORD${orderId}`,
        workflow_instance_id: workflowInstanceId,
        document_id: step.document_id,
        document_number: `ORD-${orderId}-STEP-${step.step_number}`,
        document_type: step.name,
        start_time: new Date(),
        end_time: endTime,
        duration_minutes: durationMinutes,
        status: stepStatus,
        classification: classification
      }, { transaction });

      workflowInstances.push(workflowInstance);
      // Create DeliveryNotes if step is auto-approved and completed
      if (stepStatus === 'Completed' && shouldAutoApprove) {
        try {
          // Generate DN number (you can customize this logic)
          const dnNumber = `DN-${orderId}-${step.step_number}`;
          const deliveryNote = await DeliveryNotes.create({
            dn_number: dnNumber,
            customer_name: `Customer-${orderId}`,
            cash_discount: order.cashDiscount,
            store_id: null,
            order_type: orderType,
            box: 0,
            dn_status: 'Unapproved',
            created_by: 1,
            dn_checking: false,
            invoice_key: null,
            remark: `Auto-approved from workflow step ${step.step_number}`,
            amt: order.total_amount,
            total: order.grand_total,
          }, { transaction });

          // Create DeliveryNotesDetails for each item
          if (items && items.length > 0) {
            for (const item of items) {

              await DeliveryNotesDetails.create({
                delivery_notes_id: deliveryNote.id, 
                order_id: orderId,
                dn_item_details: null,
                item_name: item.product_name || 'Unknown Item',
                item_id: item.id,
                month_code: item.monthCode || new Date().toISOString().slice(0, 7),
                order_qty: item.quantity || 0,
                dispatch_qty: item.dispatchQuantity || item.quantity || 0,
                dp: item.dp || 0,
                discount: item.discount || 0,
                amount: item.amount || '0'
              }, { transaction });
            }
          } else {
            console.log('No items found to create DeliveryNotesDetails');
          }

        } catch (dnError) {
          console.error('Error creating DeliveryNotes:', dnError);
          throw dnError;
        }
      }
      // If current step is not auto-approved, break the chain
      if (stepStatus === 'Pending') {
        console.log(`Step ${step.step_number} is pending. Stopping workflow chain.`);
        break;
      }
    }

    await updateWorkflowInstanceId(workflowTemplate?.workflow_template_id, orderId, workflowInstanceId, transaction);

    return {
      instances: workflowInstances.map(instance => instance.toJSON()),
      workflowInstanceId,
      overallStatus: currentStatus
    };

  } catch (error) {
    console.error('Error creating workflow:', error);
    throw error;
  }
};
const updateWorkflowInstanceId = async (workflowTemplateId, orderId, workflowInstanceId, transaction) => {

  // Update the order
  await Order.update(
    { workflow_instance_id: workflowInstanceId },
    {
      where: { id: orderId },
      transaction
    }
  );
  // Update all workflow instances
  await WorkflowInstance.update(
    { workflow_instance_id: workflowInstanceId },
    {
      where: { workflow_template_id: workflowTemplateId },
      transaction
    }
  );

};

module.exports = orderController;