// src/components/ReservationForm.js

import React, { useState } from 'react';

const ReservationForm = ({ onSubmit }) => {
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [numPeople, setNumPeople] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            customer_name: customerName,
            phone_number: phoneNumber,
            email,
            group_size: numPeople,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>名前:</label>
                <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>電話番号:</label>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>メールアドレス:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>人数:</label>
                <input
                    type="number"
                    value={numPeople}
                    onChange={(e) => setNumPeople(parseInt(e.target.value, 10))}
                    min="1"
                    required
                />
            </div>
            <button type="submit">確認画面へ</button>
        </form>
    );
};

export default ReservationForm;
