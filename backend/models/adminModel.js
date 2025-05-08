const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // optional: restrict values
        default: 'admin', 
    },
});

// Middleware to hash the password before saving the user
AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash if password is modified
        
    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10); // You can adjust the salt rounds
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const Admin = mongoose.model('Admin', AdminSchema, 'admin' );

module.exports = Admin;
