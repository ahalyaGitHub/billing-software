const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

// Define routes
router.post('/create', billController.createBill);  // Create a bill
router.get('/', billController.getBills);  
router.put("/search", billController.search);

router.get("/userbills",billController.getUserBills);

router.get('/:id', billController.getBillById);     // Get a single bill by ID
router.put('/update-status/:id', billController.updateBillStatus); // Update bill status
router.put("/update/:id", billController.updateBill);
router.delete('/delete/:id', billController.deleteBill);    // Delete a bill

module.exports = router;
