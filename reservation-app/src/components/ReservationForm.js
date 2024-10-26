import React, { useState } from 'react';
import axios from 'axios';

const ReservationForm = ({ token }) => {
    const [formData, setFormData] = useState({ slot_id: '', customer_name: '', customer_email: '', num_people: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

// src/components/ReservationForm.js
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/reservations`, formData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        alert('予約が作成されました');
    } catch (error) {
        alert('予約作成に失敗しました');
    }
};


    return (
        <form onSubmit={handleSubmit}>
            <input name="slot_id" placeholder="スロットID" value={formData.slot_id} onChange={handleChange} />
            <input name="customer_name" placeholder="名前" value={formData.customer_name} onChange={handleChange} />
            <input name="customer_email" placeholder="メールアドレス" value={formData.customer_email} onChange={handleChange} />
            <input name="num_people" placeholder="人数" value={formData.num_people} onChange={handleChange} />
            <button type="submit">予約作成</button>
        </form>
    );
};

export default ReservationForm;
