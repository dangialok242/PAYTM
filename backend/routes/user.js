const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js'); // Apna User Model import kar rahe hain

// User Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email,phone, password } = req.body;

        // 1. Check karein ki user pehle se to nahi hai
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Ye email pehle se registered hai!" });
        }

        // 2. Password ko secure (hash) karein
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Database mein naya account banayein
        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
        });

        // 4. Token generate karein
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.status(201).json({
            message: "User successfully created! 🎉",
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server mein kuch gadbad hai" });
    }
});

// --- USER LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check karein ki ye email database mein hai ya nahi
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Account nahi mila. Kripya pehle Signup karein!" });
        }

        // 2. Password check karein (User ka password aur database ka password match karein)
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Password galat hai!" });
        }

        // 3. Agar password sahi hai, toh naya Token de kar login success karein
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.status(200).json({
            message: "Login successful! Aap wapas aa gaye 🎉",
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server mein kuch gadbad hai" });
    }
});
module.exports = router;