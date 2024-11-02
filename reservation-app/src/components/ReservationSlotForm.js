import React, { useState } from 'react';
import axios from 'axios';

const ReservationSlotForm = ({ slotToEdit, onUpdate }) => {
    const [slotTime, setSlotTime] = useState(slotToEdit ? slotToEdit.slot_time : '');
    const [maxGroups, setMaxGroups] = useState(slotToEdit ? slotToEdit.max_groups : 1);
    const [maxPeople, setMaxPeople] = useState(slotToEdit ? slotToEdit.max_people : 1);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (slotToEdit) {
                // 編集の場合
                await axios.put(`/api/availability/${slotToEdit.id}`, {
                    slot_time: slotTime,
                    max_groups: maxGroups,
                    max_people: maxPeople,
                });
                alert('予約枠が更新されました');
            } else {
                // 新規追加の場合
                await axios.post('/api/availability', {
                    slot_time: slotTime,
                    max_groups: maxGroups,
                    max_people: maxPeople,
                });
                alert('予約枠が作成されました');
            }
            onUpdate(); // 更新をトリガー
        } catch (error) {
            console.error('予約枠の作成/更新に失敗しました:', error);
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
            <button type="submit">{slotToEdit ? '更新' : '作成'}</button>
        </form>
    );
};

export default ReservationSlotForm;
