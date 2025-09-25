const sequelize = require('../config/db');

// Import models
const Customer = require('./Customer');
const CustomerBillingAddress = require('./CustomerBillingAddress');
const CustomerShippingAddress = require('./CustomerShippingAddress');
const CustomerContact = require('./CustomerContact');
const CustomerBusinessDetail = require('./CustomerBusinessDetail');
const CustomerDocument = require('./CustomerDocument');
const CustomerAccountDetail = require('./CustomerAccountDetail');

const Department = require('./Department');
const Rights = require('./Right');
const Role = require('./Role');
const RoleRight = require('./RoleRight');
const Employee = require('./Employee');
const User = require('./User');

const WorkflowTemplate = require('./WorkflowTemplate');
const WorkflowStep = require('./WorkflowStep');
const WorkflowInstance = require('./WorkflowInstance')

const Order = require('./Order');
const Document = require('./Document');
const OrderItem = require('./OrderItem')
const CustomerTerms = require('./CustomerTerms')
const Overdues = require('./Overdues');
const CreditLimits = require('./CreditLimits')
const DeliveryNotes = require('./DeliveryNotes')
const DeliveryNotesDetails = require('./DeliveryNotesDetails')
const  PendingOrderItem = require('./PendingOrderItem')
// customer Related models
const FgPrice = require('./FgPrice');
const PriceLists = require('./PriceLists');
const FgName = require('./FgName');
const Stores = require('./Stores');
const Branches = require('./Branches');
const DiscountLists = require('./DiscountLists');
const Zone = require('./Zone');
const CustomersCategory = require('./CustomerCategories');
//=====================
// Order Associations
//=====================
// Customer.hasMany(Order, { foreignKey: 'cust_id', as: 'orders' });
// Order.belongsTo(Customer, { foreignKey: 'cust_id' });

// Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
// OrderItem.belongsTo(Order, { foreignKey: 'order_id' });


// Order.belongsTo(CustomerShippingAddress, { 
//   foreignKey: 'shipping_address_id', 
//   as: 'shippingAddress' 
// });

// Order.belongsTo(CustomerBillingAddress, { 
//   foreignKey: 'billing_address_id', 
//   as: 'billingAddress' 
// });
// =======================
// Customer Associations
// =======================

Customer.hasMany(CustomerBillingAddress, { foreignKey: 'cust_id', as: 'billingAddresses' });
CustomerBillingAddress.belongsTo(Customer, { foreignKey: 'cust_id' });

Customer.hasMany(CustomerShippingAddress, { foreignKey: 'cust_id', as: 'shippingAddresses' });
CustomerShippingAddress.belongsTo(Customer, { foreignKey: 'cust_id' });

Customer.hasOne(CustomerContact, { foreignKey: 'cust_id', as: 'contact' });
CustomerContact.belongsTo(Customer, { foreignKey: 'cust_id' });

Customer.hasOne(CustomerBusinessDetail, { foreignKey: 'cust_id', as: 'businessDetail' });
CustomerBusinessDetail.belongsTo(Customer, { foreignKey: 'cust_id' });

Customer.hasOne(CustomerDocument, { foreignKey: 'cust_id', as: 'documents' });
CustomerDocument.belongsTo(Customer, { foreignKey: 'cust_id' });

Customer.hasOne(CustomerAccountDetail, { foreignKey: 'cust_id', as: 'accountDetail' });
CustomerAccountDetail.belongsTo(Customer, { foreignKey: 'cust_id' });

Customer.hasOne(Overdues, { foreignKey: 'cust_id', as: 'overdues' });
Overdues.belongsTo(Customer, { foreignKey: 'cust_id' });

Customer.hasOne(CreditLimits, { foreignKey: 'cust_id', as: 'creditLimits' });
CreditLimits.belongsTo(Customer, { foreignKey: 'cust_id' });

// =======================
// Department & Rights
// =======================
Department.hasMany(Rights, { foreignKey: 'dep_id', as: 'rights' });
Rights.belongsTo(Department, { foreignKey: 'dep_id' });

// =======================
// Role & Rights (Many-to-Many)
// =======================
Role.belongsToMany(Rights, { through: RoleRight, foreignKey: 'role_id', otherKey: 'right_id', as: 'rights' });
Rights.belongsToMany(Role, { through: RoleRight, foreignKey: 'right_id', otherKey: 'role_id', as: 'roles' });

// =======================
// Department & Role
// =======================
Department.hasMany(Role, { foreignKey: 'dep_id', as: 'roles' });
Role.belongsTo(Department, { foreignKey: 'dep_id' });

// =======================
// Department & Employee
// =======================
Department.hasMany(Employee, { foreignKey: 'dep_id', as: 'employees' });
Employee.belongsTo(Department, { foreignKey: 'dep_id' });

// =======================
// User & Employee
// =======================
// User.hasOne(Employee, { foreignKey: 'user_id', as: 'employee' });
// Employee.belongsTo(User, { foreignKey: 'id' });

User.hasOne(Employee, { foreignKey: 'user_id', as: 'employee' });
Employee.belongsTo(User, { foreignKey: 'user_id', as: 'user' }); 

// =======================
// Order Associations
// =======================
// Customer ↔ Orders
Customer.hasMany(Order, { foreignKey: 'cust_id', as: 'orders' });
Order.belongsTo(Customer, { foreignKey: 'cust_id' });

// Order ↔ Billing/Shipping
Order.belongsTo(CustomerShippingAddress, {
  foreignKey: 'shipping_address_id',
  as: 'shippingAddress'
});
Order.belongsTo(CustomerBillingAddress, {
  foreignKey: 'billing_address_id',
  as: 'billingAddress'
});


// // =======================
// // Workflow Associations
// // =======================

// WorkflowTemplate ↔ WorkflowStep (1:N)
WorkflowTemplate.hasMany(WorkflowStep, {
  foreignKey: 'workflow_template_id',
  as: 'steps'
});
WorkflowStep.belongsTo(WorkflowTemplate, {
  foreignKey: 'workflow_template_id',
  as: 'template'
});

// WorkflowTemplate ↔ WorkflowInstance (1:N)
WorkflowTemplate.hasMany(WorkflowInstance, {
  foreignKey: 'workflow_template_id',
  as: 'instances'
});
WorkflowInstance.belongsTo(WorkflowTemplate, {
  foreignKey: 'workflow_template_id',
  as: 'template'
});

// WorkflowStep ↔ Department
// Department.hasMany(WorkflowStep, {
//   foreignKey: 'assigned_department',
//   as: 'workflowSteps'
// });
// WorkflowStep.belongsTo(Department, {
//   foreignKey: 'assigned_department',
//   as: 'department'
// });

// // WorkflowStep ↔ User
// User.hasMany(WorkflowStep, {
//   foreignKey: 'assigned_user_id',
//   as: 'workflowSteps'
// });
// WorkflowStep.belongsTo(User, {
//   foreignKey: 'assigned_user_id',
//   as: 'assignedUser'
// });

// Order ↔ WorkflowInstance (1:1 or 1:N)
// Order.hasOne(WorkflowInstance, {
//   foreignKey: 'order_id',
//   as: 'workflowInstance'
// });
// WorkflowInstance.belongsTo(Order, {
//   foreignKey: 'order_id',
//   as: 'order'
// });

WorkflowStep.hasOne(WorkflowInstance, {
  foreignKey: 'step_id',
  as: 'instance'
});
WorkflowInstance.belongsTo(WorkflowStep, {
  foreignKey: 'step_id',
  as: 'step'
});

// =======================
// Export all models
// =======================
module.exports = {
  sequelize,
  Customer,
  WorkflowTemplate,
  WorkflowStep,
  WorkflowInstance,
  OrderItem,
  CustomerBillingAddress,
  CustomerShippingAddress,
  CustomerContact,
  CustomerBusinessDetail,
  CustomerDocument,
  CustomerAccountDetail,
  Department,
  Rights,
  Role,
  RoleRight,
  Employee,
  User,
  CustomerTerms,
  Overdues,
  CreditLimits,
  Document,
  DeliveryNotes,
  DeliveryNotesDetails,
  Order,
  PendingOrderItem,
  // customer related models
  FgPrice,
  PriceLists,
  FgName,
  Stores,
  Branches,
  DiscountLists,
  Zone,
  CustomersCategory
  // customer related models

};
