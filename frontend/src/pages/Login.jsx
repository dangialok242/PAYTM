import React, { useState } from 'react';
import api from '../api/axiosConfig';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                // Login request (Email/Phone aur Password)
                const res = await api.post('/user/login', { email: phone, password });
                localStorage.setItem('token', res.data.token);
                alert('Login Successful! 🎉');
                window.location.reload();
            } else {
                // Signup request
                const res = await api.post('/user/register', { name, phone, email, password });
                localStorage.setItem('token', res.data.token);
                alert('Account Created Successful! 🎉');
                window.location.reload();
            }
        } catch (error) {
            console.error("API Error:", error);
            alert(error.response?.data?.message || 'Server se connect nahi ho pa raha!');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-blue-900">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
                <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
                    {isLogin ? 'Paytm Login' : 'Create Paytm Account'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-700"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-700"
                                required
                            />
                        </>
                    )}
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-700"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-700"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    {isLogin ? "Account nahi hai?" : "Pehle se account hai?"}{' '}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        {isLogin ? 'Sign Up karein' : 'Login karein'}
                    </button>
                </p>
            </div>
        </div>
    );
}