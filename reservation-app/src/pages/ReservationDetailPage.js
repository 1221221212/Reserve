// src/pages/ReservationDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ReservationManagement.scss';

const ReservationDetailPage = () => {
    const { id } = useParams(); // URLから予約IDを取得
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('トークンが見つかりません。再度ログインしてください。');
                    navigate('/admin/login'); // トークンがない場合、ログインページにリダイレクト
                    return;
                }

                const response = await axios.get(`/api/reservations/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setReservation(response.data);
            } catch (error) {
                console.error('予約詳細の取得に失敗しました:', error);
            }
        };

        fetchReservation();
    }, [id, navigate]);

    if (!reservation) return <div>Loading...</div>;

    return (
        <div className="reservation-detail">
            <h2>予約詳細</h2>
            <div className="reservation-field">
                <span className="label">予約者名:</span>
                <span className="value">{reservation.customer_name}</span>
            </div>
            <div className="reservation-field">
                <span className="label">人数:</span>
                <span className="value">{reservation.group_size}人</span>
            </div>
            <div className="reservation-field">
                <span className="label">電話番号:</span>
                <span className="value">{reservation.phone_number}</span>
            </div>
            <div className="reservation-field">
                <span className="label">メールアドレス:</span>
                <span className="value">{reservation.email}</span>
            </div>
            <div className="reservation-field">
                <span className="label">予約ID:</span>
                <span className="value">{reservation.reservation_number}</span>
            </div>
            <div className="reservation-field">
                <span className="label">ステータス:</span>
                <span className="value">{reservation.status}</span>
            </div>
            <div className="reservation-field">
                <span className="label">予約作成日:</span>
                <span className="value">{reservation.created_at}</span>
            </div>
            <button className="edit-button">予約を編集</button>
        </div>
    );
};

export default ReservationDetailPage;
