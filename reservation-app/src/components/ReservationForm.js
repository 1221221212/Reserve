// src/components/ReservationForm.js
import React, { useState } from 'react';
import axios from 'axios';

const ReservationForm = () => {
    const [slotTime, setSlotTime] = useState('');
    const [maxGroups, setMaxGroups] = useState(1);
    const [maxPeople, setMaxPeople] = useState(1);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/availability', {
                slotTime,
                maxGroups,
                maxPeople,
            });
            alert('予約枠が作成されました');
        } catch (error) {
            console.error('予約枠の作成に失敗しました:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>スロット時間:</label>
                <input 
                    type="time" 
                    value={slotTime} 
                    onChange={(e) => setSlotTime(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>最大グループ数:</label>
                <input 
                    type="number" 
                    value={maxGroups} 
                    onChange={(e) => setMaxGroups(e.target.value)} 
                    min="1" 
                    required 
                />
            </div>
            <div>
                <label>一組あたりの最大人数:</label>
                <input 
                    type="number" 
                    value={maxPeople} 
                    onChange={(e) => setMaxPeople(e.target.value)} 
                    min="1" 
                    required 
                />
            </div>
            <button type="submit">予約枠を作成</button>
        </form>
    );
};

export default ReservationForm;
