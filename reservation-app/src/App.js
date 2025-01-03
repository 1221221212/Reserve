import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ReservationPage from './pages/ReservationPage';
import AdminPage from './pages/AdminPage';
import Login from './components/Login';
import "./styles/Common.scss";

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken && savedToken !== token) {
            setToken(savedToken); // トークンが変わったときに状態を更新
        }
    }, [token]); // token の変更を依存に追加

    return (
        <Routes>
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/" element={<Navigate to="/reservation" />} />
            <Route 
                path="/admin/*" 
                element={token ? <AdminPage token={token} /> : <Navigate to="/login" />} 
            />
            <Route path="/login" element={<Login setToken={setToken} />} />
        </Routes>
    );
};

export default App;
