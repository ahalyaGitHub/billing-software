const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/',adminController.addAdmin);
router.get('/:id',adminController.getAdminName);
router.post('/login',adminController.loginAdmin);

module.exports = router;