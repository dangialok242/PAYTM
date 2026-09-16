// backend/routes/txnRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMid');
const { transferMoney, getTransactionHistory } = require('../controllers/txnController');

// 1. Paise bhejne ka route
router.post('/transfer', protect, transferMoney);

// 2. Passbook / History dekhne ka route
router.get('/history', protect, getTransactionHistory);

module.exports = router;