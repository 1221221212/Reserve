// src/components/ReservationForm.js

import React, { useState } from 'react';

const ReservationForm = ({ date, slot, onSubmit }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [groupSize, setGroupSize] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, phone, email, groupSize });
    };

    return (
        <div>
            <h2>予約情報入力</h2>
            <p>{date.toLocaleDateString()} - {slot.startTime} から {slot.endTime}</p>
            <form onSubmit={handleSubmit}>
                <label>
                    名前:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <label>
                    電話番号:
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </label>
                <label>
                    メールアドレス:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    人数:
                    <input type="number" value={groupSize} onChange={(e) => setGroupSize(e.target.value)} min="1" required />
                </label>
                <button type="submit">次へ</button>
            </form>
        </div>
    );
};

export default ReservationForm;
