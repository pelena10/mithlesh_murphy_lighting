const express = require('express');
const router = express.Router();
const { customerController } = require('../controllers/customerController');
const customerValidation = require('../validations/customerValidation');
const {upload} = require('../utils/customerMulter');
// CRUD routes
router.get('/master-data-customer', customerController.getMasterDataCustomer);
router.get('/', customerController.getCustomers);
router.get('/name-list', customerController.getCustomersNameList);
router.get('/:id', customerValidation.getCustomerById,  customerController.getCustomerById);
router.get('/:id', customerValidation.getCustomerById,  customerController.getCustomersNameList);
router.post('/', customerValidation.createCustomer,  customerController.createCustomer);
router.put('/:id', customerValidation.updateCustomer,  customerController.updateCustomer);
router.delete('/:id', customerValidation.deleteCustomer,  customerController.deleteCustomer);

// Document upload route
router.post('/:id/documents', 
  upload.fields([
    { name: 'shop_image_1', maxCount: 1 },
    { name: 'shop_image_2', maxCount: 1 },
    { name: 'shop_image_3', maxCount: 1 },
    { name: 'shop_image_4', maxCount: 1 },
    { name: 'image_security_cheque_1', maxCount: 1 },
    { name: 'image_security_cheque_2', maxCount: 1 },
    { name: 'image_security_cheque_3', maxCount: 1 },
    { name: 'image_security_cheque_4', maxCount: 1 },
    { name: 'gst_certificate_image', maxCount: 1 }
  ]),
  customerController.uploadDocuments
);

module.exports = router;
