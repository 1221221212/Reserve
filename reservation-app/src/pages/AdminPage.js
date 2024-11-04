// src/pages/AdminPage.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNav from '../components/AdminNav';
import SlotManagementPage from './SlotManagementPage';
import SlotCreationPage from './SlotCreationPage';
import ReservationManagementPage from './ReservationManagementPage';
import PatternManagementPage from './PatternManagementPage';
import PatternCreationPage from './PatternCreationPage';

const AdminPage = () => {
    return (
        <div className="admin-page">
            <AdminNav />
            <div className="admin-content">
                <Routes>
                    <Route path="/" element={<ReservationManagementPage/>} />
                    <Route path="slots" element={<SlotManagementPage />} />
                    <Route path="slots/create" element={<SlotCreationPage />} />
                    <Route path="reservations" element={<ReservationManagementPage />} />
                    <Route path="patterns" element={<PatternManagementPage />} />
                    <Route path="patterns/create" element={<PatternCreationPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminPage;
