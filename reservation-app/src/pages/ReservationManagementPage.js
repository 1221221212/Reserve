import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReservationManagementPage = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get('/api/reservations');
                setReservations(response.data);
            } catch (error) {
                console.error('予約情報の取得に失敗しました:', error);
            }
        };

        fetchReservations();
    }, []);

    return (
        <div>
            <h1>予約者管理</h1>
            <ul>
                {reservations.map(reservation => (
                    <li key={reservation.id}>
                        {reservation.customer_name} - {reservation.num_people}人
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReservationManagementPage;
