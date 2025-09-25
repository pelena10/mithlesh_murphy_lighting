const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Order routes
router.post('/', orderController.createOrder);
router.get('/pending', orderController.getPendingOrders);
router.get('/pending-items/:id', orderController.getPendingOrderItems);
router.get('/total-cust-pending-order/:id', orderController.getTotalCustPendingOrders);
// items  routes
router.post('/temp-items', orderController.addOrderItem);
router.get('/temp-items-cust/:cust_id', orderController.getOrderItemsAll);
router.put('/temp-items/:id', orderController.updateOrderItem);
router.delete('/temp-items/:id', orderController.deleteOrderItem);


module.exports = router;