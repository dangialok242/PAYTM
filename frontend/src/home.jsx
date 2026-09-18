import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function Home() {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [receiverPhone, setReceiverPhone] = useState('');
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();

    // Updated fetchData function with token check & array validation
    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const userRes = await api.get('/user/me');
            setUser(userRes.data);

            const txnRes = await api.get('/txn/history');
            setTransactions(Array.isArray(txnRes.data) ? txnRes.data : []);
        } catch (error) {
            console.error("Data load error:", error);
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Paise bhejne ka function
    const handleTransfer = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/txn/transfer', {
                receiverPhone,
                amount: Number(amount)
            });
            alert(response.data.message || "Transfer Successful! 🎉");
            setReceiverPhone('');
            setAmount('');
            fetchData(); // Page refresh kiye bina balance aur history update karna
        } catch (error) {
            alert(error.response?.data?.message || "Transfer fail ho gaya!");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!user) return <div className="text-center mt-20 text-xl font-bold text-gray-700">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6 pb-12">
            {/* Navbar */}
            <div className="max-w-md mx-auto flex justify-between items-center bg-white p-4 rounded-xl shadow-md mb-6">
                <h1 className="text-xl font-bold text-blue-600">Paytm Clone</h1>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600">
                    Logout
                </button>
            </div>

            {/* Wallet Balance Card */}
            <div className="max-w-md mx-auto bg-blue-600 text-white p-6 rounded-2xl shadow-lg mb-6">
                <p className="text-sm opacity-80">Welcome, {user.name}</p>
                <h2 className="text-3xl font-bold mt-1">₹ {user.balance}</h2>
                <p className="text-xs mt-2 opacity-75">Phone: {user.phone}</p>
            </div>

            {/* Transfer Money Form */}
            <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Transfer Money</h3>
                <form onSubmit={handleTransfer} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Receiver Phone Number</label>
                        <input 
                            type="text" 
                            value={receiverPhone} 
                            onChange={(e) => setReceiverPhone(e.target.value)} 
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                            placeholder="Enter 10 digit number"
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Amount (₹)</label>
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                            placeholder="Enter amount"
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                        Send Money
                    </button>
                </form>
            </div>

            {/* Passbook / Transaction History Section */}
            <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Passbook / History</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                    {transactions.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center">Koi transaction nahi hai.</p>
                    ) : (
                        transactions.map((txn) => {
                            const senderId = typeof txn.sender === 'object' ? txn.sender?._id?.toString() : String(txn.sender);
                            const currentUserId = String(user?._id || user?.id);
                            const isSender = senderId === currentUserId;

                            return (
                                <div key={txn._id || Math.random()} className="flex justify-between items-center p-3 border-b text-sm">
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {isSender 
                                                ? `Paid to: ${txn.receiver?.name || txn.receiver?.phone || 'User'}` 
                                                : `Received from: ${txn.sender?.name || txn.sender?.phone || 'User'}`
                                            }
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {txn.createdAt ? new Date(txn.createdAt).toLocaleString() : ''}
                                        </p>
                                    </div>
                                    <span className={`font-bold ${isSender ? 'text-red-500' : 'text-green-600'}`}>
                                        {isSender ? `- ₹${txn.amount}` : `+ ₹${txn.amount}`}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}