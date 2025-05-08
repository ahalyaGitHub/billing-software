const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to add an admin
exports.addAdmin = async (req, res) => {
    try {
        const user = new Admin(req.body);
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to login an admin
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).send('Admin not found');

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        // Generate a JWT token
        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set the token and role in headers
        res.setHeader('Authorization', `Bearer ${token}`);
        res.setHeader('Role', 'Admin');

        // Log the token and role in the console
        console.log('JWT Token:', token);
        console.log('Role:', 'Admin');

        // Return the token and role in the response body as well (optional)
        return res.json({ token, role: 'Admin' });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).send('Server error');
    }
};

exports.getAdminName = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select('name');
        if (!user) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json({ adminname: admin.name });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin data' });
    }
};
