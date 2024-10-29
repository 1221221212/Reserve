// src/App.js
import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ReservationPage from './pages/ReservationPage';
import AdminPage from './pages/AdminPage';
import Login from './components/Login';

const App = () => {
    const [token, setToken] = useState(null);

    return (
        <Routes>
            {/* ユーザー用ルート */}
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/" element={<Navigate to="/reservation" />} />

            {/* 管理者用ルート */}
            <Route 
                path="/admin/*" 
                element={token ? <AdminPage token={token} /> : <Login setToken={setToken} />} 
            />
        </Routes>
    );
};

export default App;
