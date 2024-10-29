// src/pages/AdminPage.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNav from '../components/AdminNav';
import SlotManagementPage from './SlotManagementPage'; // 予約枠の管理ページ
import DateSelectionPage from './DateSelectionPage'; // 予約枠の作成ページ
import PatternAssignmentPage from './PatternAssignmentPage'; // パターン割り当てページ
import ReservationManagementPage from './ReservationManagementPage'; // 予約管理ページ

const AdminPage = () => {
    return (
        <div>
            <AdminNav />
            <div className="admin-content">
                <Routes>
                    <Route path="slots" element={<SlotManagementPage />} />
                    <Route path="create-slot" element={<DateSelectionPage />} />
                    <Route path="assign-pattern" element={<PatternAssignmentPage />} />
                    <Route path="reservations" element={<ReservationManagementPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminPage;
