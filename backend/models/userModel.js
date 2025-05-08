const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
    },
    company_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // optional: restrict values
        default: 'user', 
    }
});

// Middleware to hash the password before saving the user
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash if password is modified
        
    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema, 'user');

module.exports = User;
