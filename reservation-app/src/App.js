import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ReservationPage from './pages/ReservationPage';
import AdminPage from './pages/AdminPage';
import Login from './components/Login';

const App = () => {
    const [token, setToken] = useState(null);

    return (
        <Routes>
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/admin" element={token ? <AdminPage token={token} /> : <Login setToken={setToken} />} />
            <Route path="/" element={<Navigate to="/reservation" />} />
        </Routes>
    );
};

export default App;