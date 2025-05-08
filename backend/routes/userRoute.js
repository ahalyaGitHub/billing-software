const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register route
router.post('/register', userController.registerUser);
router.get("/", userController.getAllUsers);
// Login route
router.post('/login', userController.loginUser);
router.get('/:id', userController.fetchUser);
router.put("/:id", userController.updateUserById);
router.delete("/:id", userController.deleteUserById);

module.exports = router;
