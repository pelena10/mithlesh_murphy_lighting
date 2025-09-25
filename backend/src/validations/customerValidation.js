const { body, param } = require('express-validator');

const customerValidation = {
  // Customer validation rules
  createCustomer: [
    body('cust_name')
      .notEmpty()
      .withMessage('Customer name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Customer name must be between 2 and 100 characters'),
    
    body('gst_no')
      .optional()
      .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
      .withMessage('Invalid GST number format'),
    
    body('pan')
      .optional()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
      .withMessage('Invalid PAN format'),
    
    body('aadhar')
      .optional()
      .matches(/^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/)
      .withMessage('Invalid Aadhar format (should be XXXX XXXX XXXX)'),
    
    body('cust_status')
      .isIn(['Active', 'Inactive'])
      .withMessage('Status must be either Active or Inactive'),
    
    // Billing address validation
    body('billingAddresses.*.billing_address')
      .notEmpty()
      .withMessage('Billing address is required'),
    
    body('billingAddresses.*.billing_city')
      .notEmpty()
      .withMessage('Billing city is required'),
    
    body('billingAddresses.*.billing_state')
      .notEmpty()
      .withMessage('Billing state is required'),
    
    body('billingAddresses.*.billing_pin_code')
      .notEmpty()
      .isPostalCode('IN')
      .withMessage('Invalid PIN code'),
    
    // Contact validation
    body('contact.register_mobile')
      .notEmpty()
      .isMobilePhone('any')
      .withMessage('Valid mobile number is required'),
    
    body('contact.register_email')
      .notEmpty()
      .isEmail()
      .withMessage('Valid email is required'),
  ],

  updateCustomer: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid customer ID'),
    
    // Reuse create validations but make fields optional
    body('cust_name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Customer name must be between 2 and 100 characters'),
    
    body('gst_no')
      .optional()
      .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
      .withMessage('Invalid GST number format'),
    
    // Add other validation rules as needed
  ],

  getCustomerById: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid customer ID')
  ],

  deleteCustomer: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid customer ID')
  ]
};

module.exports = customerValidation;