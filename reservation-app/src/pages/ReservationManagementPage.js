// src/pages/ReservationManagementPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReservationFilter from '../components/ReservationFilter';
import '../styles/ReservationManagement.scss';

const ReservationManagementPage = () => {
    const [reservations, setReservations] = useState([]);

    const fetchReservations = async (filters) => {
        try {
            const token = localStorage.getItem('token'); 
            if (!token) {
                console.error('トークンが見つかりません。再度ログインしてください。');
                return;
            }

            const response = await axios.get('/api/reservations/filtered', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: filters
            });
            setReservations(response.data);
        } catch (error) {
            console.error('予約情報の取得に失敗しました:', error);
        }
    };

    // 初回アクセス時にデフォルトの日付範囲で予約情報を取得
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        const oneMonthLater = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0];
        fetchReservations({ startDate: today, endDate: oneMonthLater });
    }, []);

    // フィルター適用時に予約情報を再取得
    const handleApplyFilter = (filters) => {
        fetchReservations(filters);
    };

    return (
        <div className="admin-page-content">
            <h1>予約者管理</h1>
            <ReservationFilter onApplyFilter={handleApplyFilter} />
            <table className="reservation-table">
                <thead>
                    <tr>
                        <th>予約ID</th>
                        <th>予約者名</th>
                        <th>人数</th>
                        <th>予約日</th>
                        <th>予約時間</th>
                        <th>作成日</th>
                        <th>ステータス</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation.id}>
                            <td>{reservation.reservation_number}</td>
                            <td>{reservation.customer_name}</td>
                            <td>{reservation.group_size}人</td>
                            <td>{reservation.reservation_date}</td>
                            <td>{`${reservation.start_time} - ${reservation.end_time}`}</td>
                            <td>{reservation.created_at}</td>
                            <td>{reservation.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReservationManagementPage;
