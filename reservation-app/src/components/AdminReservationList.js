import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminReservationList = ({ selectedDate, selectedSlot }) => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem('token');
                let response;

                if (selectedSlot) {
                    // スロットIDで予約を取得
                    response = await axios.get(`${process.env.REACT_APP_API_URL}/reservations/filtered`, {
                        params: { slot_id: selectedSlot.id, startDate: selectedDate, endDate: selectedDate },
                        headers: { Authorization: `Bearer ${token}` },
                    });
                } else if (selectedDate) {
                    // 日付で予約を取得
                    response = await axios.get(`${process.env.REACT_APP_API_URL}/reservations/filtered`, {
                        params: { startDate: selectedDate, endDate: selectedDate },
                        headers: { Authorization: `Bearer ${token}` },
                    });
                }

                setReservations(response?.data || []);
            } catch (error) {
                console.error("予約一覧の取得に失敗しました:", error);
                setReservations([]);
            }
        };

        if (selectedDate) {
            fetchReservations();
        }
    }, [selectedDate, selectedSlot]);

    return (
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
    );
};

export default AdminReservationList;
