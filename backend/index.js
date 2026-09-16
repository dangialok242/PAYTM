require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// --- ROUTES IMPORTS --- 
// Dhyan rakhein, har variable ka naam alag hona chahiye
const userRoutes = require('./routes/userRoutes'); 
const authRoutes = require('./routes/user');       
const txnRoutes = require('./routes/txnRoutes');   

const app = express();

app.use(cors());
app.use(express.json());

// --- ROUTES SETUP ---
app.use('/api/user', userRoutes);
app.use('/api/user', authRoutes); 
app.use('/api/txn', txnRoutes); 

// Testing Route
app.get('/', (req, res) => {
    res.send("Paytm Clone Backend is Running! 🎉");
});

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Successfully Connected! 🎉");
  })
  .catch((error) => {
    console.log("Database connection failed:", error);
  });

// --- SERVER START ---
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});