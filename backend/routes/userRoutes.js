// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMid');
const { registerUser, loginUser, getUserProfile } = require('../controllers/user'); // (Ya jo bhi aapke controllers ke naam hain)

// 1. Register Route (Yahan 'protect' NAHI hona chahiye)
router.post('/register', registerUser);

// 2. Login Route (Yahan bhi 'protect' NAHI hona chahiye)
router.post('/login', loginUser);

// 3. Profile / Balance Route (Yahan 'protect' HONA chahiye taaki sirf logged-in user dekh sake)
router.get('/me', protect, getUserProfile);
module.exports = router;