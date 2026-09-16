const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 10000 }
});

module.exports = mongoose.model('User', userSchema);