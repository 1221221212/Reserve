import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import Breadcrumb from '../components/Breadcrumb';
import AdminNav from '../components/AdminNav';
import AdminCalendarPage from './AdminCalendarPage'
import SlotManagementPage from './SlotManagementPage';
import CloseManagementPage from './CloseManagementPage';
import CloseSettingPage from './CloseSettingPage';
import SlotCreationPage from './SlotCreationPage';
import ReservationManagementPage from './ReservationManagementPage';
import ReservationDetailPage from './ReservationDetailPage';
import PatternManagementPage from './PatternManagementPage';
import PatternCreationPage from './PatternCreationPage';
import SettingsPage from './SettingsPage';
import InfoSettings from '../components/InfoSettings';
import ReservationSettings from '../components/ReservationSettings';
import { isTokenExpired, refreshAccessToken } from '../utils/authUtils';
import "../styles/AdminPage.scss";

const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState({ activeParent: null, activeChild: null });
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen); // メニュー開閉を切り替え
    };

    useEffect(() => {
        const checkAndRefreshToken = async () => {
            const token = localStorage.getItem('token');
            if (!token || isTokenExpired(token, 5 * 60 * 1000)) { // 5分前に期限切れならリフレッシュ
                const newToken = await refreshAccessToken();
                if (!newToken) {
                    localStorage.removeItem('token'); // トークン更新に失敗した場合、削除してリダイレクト
                    setIsAuthenticated(false);
                    navigate('/login'); // ログインページにリダイレクト
                } else {
                    setIsAuthenticated(true);
                }
            }
        };

        checkAndRefreshToken(); // 初回実行

        // トークンのリフレッシュ確認を定期的に実行
        const intervalId = setInterval(checkAndRefreshToken, 60 * 1000); // 1分ごとにチェック

        return () => clearInterval(intervalId); // クリーンアップ
    }, [navigate]);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="admin-page">
            <AdminHeader isOpen={isOpen} toggleMenu={toggleMenu} />
            <Breadcrumb activeMenu={activeMenu} /> {/* パンくずメニューに状態を渡す */}
            <AdminNav isOpen={isOpen} toggleMenu={toggleMenu} setActiveMenu={setActiveMenu} />
            <div className={`overlay ${isOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
            <div className="admin-content">
                <Routes>
                    <Route path="/" element={<Navigate to="/admin/calendar" />} />
                    <Route path="calendar" element={<AdminCalendarPage />} />
                    <Route path="slots" element={<SlotManagementPage />} />
                    <Route path="slots/patterns" element={<PatternManagementPage />} />
                    <Route path="slots/patterns/create" element={<PatternCreationPage />} />
                    <Route path="slots/create" element={<SlotCreationPage />} />
                    <Route path="slots/close" element={<CloseManagementPage />} />
                    <Route path="slots/close/settings" element={<CloseSettingPage />} />
                    <Route path="reservations" element={<ReservationManagementPage />} />
                    <Route path="reservations/:id" element={<ReservationDetailPage />} />
                    <Route path="settings" element={<SettingsPage />}>
                        <Route path="info" element={<InfoSettings />} />
                        <Route path="reservation" element={<ReservationSettings />} />
                    </Route>
                </Routes>
            </div>
        </div>
    );
};

export default AdminPage;
