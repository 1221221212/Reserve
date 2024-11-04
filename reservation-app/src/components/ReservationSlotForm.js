// src/components/ReservationSlotForm.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ReservationSlotForm.scss';

const ReservationSlotForm = ({ slotToEdit, onUpdate }) => {
    const [slotTime, setSlotTime] = useState(slotToEdit ? slotToEdit.slot_time : '');
    const [maxGroups, setMaxGroups] = useState(slotToEdit ? slotToEdit.max_groups : 1);
    const [maxPeople, setMaxPeople] = useState(slotToEdit ? slotToEdit.max_people : 1);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (slotToEdit) {
                await axios.put(`/api/availability/${slotToEdit.id}`, {
                    slot_time: slotTime,
                    max_groups: maxGroups,
                    max_people: maxPeople,
                });
                alert('予約枠が更新されました');
            } else {
                await axios.post('/api/availability', {
                    slot_time: slotTime,
                    max_groups: maxGroups,
                    max_people: maxPeople,
                });
                alert('予約枠が作成されました');
            }
            onUpdate();
        } catch (error) {
            console.error('予約枠の作成/更新に失敗しました:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="reservation-slot-form">
            <div className="form-group">
                <label>スロット時間:</label>
                <input 
                    type="time" 
                    value={slotTime} 
                    onChange={(e) => setSlotTime(e.target.value)} 
                    required 
                />
            </div>
            <div className="form-group">
                <label>最大グループ数:</label>
                <input 
                    type="number" 
                    value={maxGroups} 
                    onChange={(e) => setMaxGroups(parseInt(e.target.value, 10))} 
                    min="1" 
                    required 
                />
            </div>
            <div className="form-group">
                <label>一組あたりの最大人数:</label>
                <input 
                    type="number" 
                    value={maxPeople} 
                    onChange={(e) => setMaxPeople(parseInt(e.target.value, 10))} 
                    min="1" 
                    required 
                />
            </div>
            <button type="submit" className="button">{slotToEdit ? '更新' : '作成'}</button>
        </form>
    );
};

export default ReservationSlotForm;
