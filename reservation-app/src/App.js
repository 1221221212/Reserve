import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ReservationPage from './pages/ReservationPage';
import AdminPage from './pages/AdminPage';
import Login from './components/Login';
import "./styles/Common.scss"

const App = () => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        // ローカルストレージからトークンを読み込み
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    return (
        <Routes>
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/" element={<Navigate to="/reservation" />} />
            <Route 
                path="/admin/*" 
                element={token ? <AdminPage token={token} /> : <Login setToken={setToken} />} 
            />
        </Routes>
    );
};

export default App;
