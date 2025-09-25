const express = require('express');
const router = express.Router();
const fgController = require('../controllers/fgController');

router.get('/', fgController.getAll);
router.get('/attributes/:id', fgController.getAllFGNameAttributes);
router.get('/:id', fgController.getById);
router.post('/', fgController.create);
router.put('/:id', fgController.update);
router.delete('/:id', fgController.delete);

module.exports = router;
