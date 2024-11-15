// src/pages/AdminPage.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminNav from '../components/AdminNav';
import SlotManagementPage from './SlotManagementPage';
import SlotCreationPage from './SlotCreationPage';
import ReservationManagementPage from './ReservationManagementPage';
import ReservationDetailPage from './ReservationDetailPage';
import PatternManagementPage from './PatternManagementPage';
import PatternCreationPage from './PatternCreationPage';
import SettingsPage from './SettingsPage';
import { isTokenExpired, refreshAccessToken } from '../utils/authUtils';
import "../styles/AdminCommon.scss";

const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAndRefreshToken = async () => {
            const token = localStorage.getItem('token');
            if (!token || isTokenExpired(token, 5 * 60 * 1000)) { // 5分前に期限切れならリフレッシュ
                const newToken = await refreshAccessToken();
                if (!newToken) {
                    localStorage.removeItem('token'); // トークン更新に失敗した場合、削除してリダイレクト
                    setIsAuthenticated(false);
                    navigate('/admin/login');
                } else {
                    setIsAuthenticated(true);
                }
            }
        };

        const intervalId = setInterval(checkAndRefreshToken, 60 * 1000); // 1分ごとにチェック
        checkAndRefreshToken(); // 初回実行

        return () => clearInterval(intervalId); // クリーンアップ
    }, [navigate]);

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <div className="admin-page">
            <AdminNav />
            <div className="admin-content">
                <Routes>
                    <Route path="/" element={<ReservationManagementPage />} />
                    <Route path="slots" element={<SlotManagementPage />} />
                    <Route path="slots/create" element={<SlotCreationPage />} />
                    <Route path="reservations" element={<ReservationManagementPage />} />
                    <Route path="reservations/:id" element={<ReservationDetailPage />} /> 
                    <Route path="patterns" element={<PatternManagementPage />} />
                    <Route path="patterns/create" element={<PatternCreationPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminPage;
