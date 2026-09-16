// backend/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId, // Sender ki User ID
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId, // Receiver ki User ID
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Success' // Failed ya Pending bhi ho sakta hai aage chalkar
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);