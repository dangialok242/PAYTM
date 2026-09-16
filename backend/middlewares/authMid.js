// backend/middlewares/authMid.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check karna ki request ke 'Headers' me token bheja gaya hai ya nahi
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // "Bearer token_string" me se sirf token nikalna (index 1)
            token = req.headers.authorization.split(' ')[1];

            // Token ko verify karna secret key ke saath
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Token me chhupi User ID se database me user dhoondhna (aur password hata dena)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Sab theek hai, aage badhne do (Route function chalne do)
        } catch (error) {
            console.error("Token verification failed:", error.message);
            res.status(401).json({ message: "Not authorized, token fail ho gaya!" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, koi token nahi mila!" });
    }
};

module.exports = { protect };