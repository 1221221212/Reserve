// src/pages/AdminPage.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNav from '../components/AdminNav';
import SlotManagementPage from './SlotManagementPage'; // 予約枠の管理ページ
import ReservationSlotPage from './ReservationSlotPage'; // 統合された予約枠作成ページ
import ReservationManagementPage from './ReservationManagementPage'; // 予約管理ページ

const AdminPage = () => {
    return (
        <div>
            <AdminNav />
            <div className="admin-content">
                <Routes>
                    <Route path="slots" element={<SlotManagementPage />} />
                    <Route path="create-slot" element={<ReservationSlotPage />} />
                    <Route path="reservations" element={<ReservationManagementPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminPage;
