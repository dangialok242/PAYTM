import React from 'react';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
    const token = localStorage.getItem('token');

    return (
        <div>
            {token ? <Home /> : <Login />}
        </div>
    );
}

export default App;