const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { user_name, company_name, email, password, phone, address } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        // Create and save new user
        const newUser = new User({
            user_name,
            company_name,
            email,
            password,
            phone,
            address
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully.', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login an existing user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    // ✅ Include phone number in token payload
    const token = jwt.sign(
      { id: user._id, userPhone: user.phone_no, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.setHeader('Authorization', `Bearer ${token}`);
    res.setHeader('Role', 'User');

    console.log('JWT Token:', token);
    console.log('Role:', 'User');

    return res.json({ token, role: 'User' });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).send('Server error');
  }
};

exports.fetchUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);  // or { user_name: user.user_name } to keep it light
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  };

  exports.updateUserById = async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: "Error updating user" });
    }
  };

  exports.deleteUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      await User.findByIdAndDelete(userId);
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error deleting user" });
    }
  };

