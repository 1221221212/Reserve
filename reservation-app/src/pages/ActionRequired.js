import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ActionRequredPage = () => {
    const [reservations, setReservations] = useState([]);

    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('トークンが見つかりません。再度ログインしてください。');
                return;
            }

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/reservations/action-required`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            setReservations(response.data);
        } catch (error) {
            console.error('予約情報の取得に失敗しました:', error);
        }
    };

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        const oneMonthLater = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0];
        fetchReservations({ startDate: today, endDate: oneMonthLater });
    }, []);

    return (
        <div className="admin-page-content">
            <table className="reservation-table">
                <thead>
                    <tr>
                        <th>詳細</th>
                        <th>予約ID</th>
                        <th>予約者名</th>
                        <th>人数</th>
                        <th>予約日</th>
                        <th>予約時間</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation.id}>
                            <td>
                                <Link to={`/admin/reservations/${reservation.id}`}>詳細</Link>
                            </td>
                            <td>{reservation.reservation_number}</td>
                            <td>{reservation.customer_name}</td>
                            <td>{reservation.group_size}人</td>
                            <td>{reservation.reservation_date}</td>
                            <td>{`${reservation.start_time} - ${reservation.end_time}`}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActionRequredPage;
