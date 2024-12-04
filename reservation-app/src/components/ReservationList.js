import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReservationList = ({ token }) => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/reservations`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReservations(response.data);
            } catch (error) {
                console.error("予約一覧の取得に失敗しました", error);
            }
        };
        fetchReservations();
    }, [token]);

    const handleCancel = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/reservations/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReservations(reservations.filter((reservation) => reservation.id !== id));
            alert('予約がキャンセルされました');
        } catch (error) {
            alert('キャンセルに失敗しました');
        }
    };

    return (
        <div>
            <h2>予約一覧</h2>
            <ul>
                {reservations.map((reservation) => (
                    <li key={reservation.id}>
                        {reservation.customer_name} ({reservation.num_people} 人)
                        <button onClick={() => handleCancel(reservation.id)}>キャンセル</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReservationList;
