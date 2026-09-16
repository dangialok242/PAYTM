const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Register User
const registerUser = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;

        if (!name || !phone || !email || !password) {
            return res.status(400).json({ message: "Sabhi fields bharna zaroori hai!" });
        }

        let user = await User.findOne({ phone });
        if (user) {
            return res.status(400).json({ message: "Ye phone number pehle se registered hai!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            phone,
            email,
            password: hashedPassword,
            balance: 10000
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
        
        res.status(201).json({ token, message: "Account Created Successfully! 🎉" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { phone: email }] });
        
        if (!user) {
            return res.status(400).json({ message: "User nahi mila!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Galat password!" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
        
        res.status(200).json({ token, message: "Login Successful! 🎉" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile };