// src/components/ReservationForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/reservationForm.scss';

const ReservationForm = ({ onSubmit, max_people, max_groups, slotId }) => {
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [numPeople, setNumPeople] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentCount, setCurrentCount] = useState(0);

    useEffect(() => {
        const fetchCurrentReservationCount = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/availability/current-reservation-count`, {
                    params: { slotId },
                });
                setCurrentCount(response.data.count);
            } catch (error) {
                console.error("現在の予約人数の取得に失敗しました:", error);
            }
        };

        fetchCurrentReservationCount();
    }, [slotId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // 最大人数のバリデーション
        if (max_people && numPeople > max_people) {
            setErrorMessage(`人数が多すぎます。最大${max_people}人までです。`);
            return;
        }

        // `max_groups`が`NULL`の場合のみ、残り人数のチェックを行う
        if (!max_groups) {
            const remainingCapacity = max_people - currentCount;

            if (remainingCapacity < numPeople) {
                setErrorMessage(`残りの人数が不足しています。予約可能な人数は最大${remainingCapacity}人です。`);
                return;
            }
        }

        // エラーメッセージをクリアして、予約情報を送信
        setErrorMessage('');
        onSubmit({
            customer_name: customerName,
            phone_number: phoneNumber,
            email: email,
            group_size: numPeople,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="reservation-form">
            <div className="form-group">
                <label>名前:</label>
                <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>電話番号:</label>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>メールアドレス:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>人数:</label>
                <input
                    type="number"
                    value={numPeople}
                    onChange={(e) => setNumPeople(parseInt(e.target.value, 10))}
                    min="1"
                    required
                />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit">予約を確認</button>
        </form>
    );
};

export default ReservationForm;
