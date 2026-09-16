// backend/controllers/txnController.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const transferMoney = async (req, res) => {
    // 1. Ek safe "Session" start karna (ACID properties ke liye)
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { receiverPhone, amount } = req.body; // Frontend se phone no. aur amount aayega
        const senderId = req.user._id; // protect middleware ne req.user diya tha

        if (amount <= 0) {
            throw new Error("Amount 0 se zyada hona chahiye!");
        }

        // 2. Sender aur Receiver dono ko database se nikalna (is session ke andar)
        const sender = await User.findById(senderId).session(session);
        const receiver = await User.findOne({ phone: receiverPhone }).session(session);

        // 3. Checks (Validation)
        if (!receiver) {
            throw new Error("Receiver (Paise lene wala) nahi mila!");
        }
        if (sender.balance < amount) {
            throw new Error("Aapke account me balance kam hai!");
        }
        if (sender.phone === receiverPhone) {
            throw new Error("Khud ko paise nahi bhej sakte!");
        }

        // 4. Asli Transfer (Sender se minus, Receiver me plus)
        sender.balance -= amount;
        receiver.balance += amount;

        // Dono ka naya balance save karna
        await sender.save({ session });
        await receiver.save({ session });

        // 5. Transaction History me record save karna
        const txn = new Transaction({
            sender: sender._id,
            receiver: receiver._id,
            amount
        });
        await txn.save({ session });

        // 6. Agar yahan tak sab pass ho gaya, toh Envelope SEAL kar do (Commit)
        await session.commitTransaction();
        res.status(200).json({ message: "Transfer Successful! ✅", txn });

    } catch (error) {
        // Agar koi bhi error aayi, toh pura process cancel kar do (Rollback)
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        // Session ko end kar do taaki memory free ho jaye
        session.endSession();
    }
};

// Purani transactions nikalne ke liye function
const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find transactions jahan user ya toh sender ho ya receiver
        const transactions = await Transaction.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .populate('sender', 'name phone')   // Sender ka naam aur phone dikhane ke liye
        .populate('receiver', 'name phone') // Receiver ka naam aur phone dikhane ke liye
        .sort({ createdAt: -1 });           // Sabse nayi transaction sabse upar dikhegi

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "History laane me error aayi", error: error.message });
    }
};

// Export me isko bhi jod dein (pehle wale functions ke sath)
module.exports = { transferMoney, getTransactionHistory };

