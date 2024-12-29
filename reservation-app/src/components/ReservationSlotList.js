import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReservationSlotList = () => {
    const [slots, setSlots] = useState([]);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await axios.get('/availability');
                setSlots(response.data);
            } catch (error) {
                console.error('予約枠の取得に失敗しました:', error);
            }
        };

        fetchSlots();
    }, []);

    const handleDelete = async (slotId) => {
        try {
            await axios.delete(`/availability/${slotId}`);
            setSlots(slots.filter(slot => slot.id !== slotId)); // 削除後にリストを更新
            alert('予約枠が削除されました');
        } catch (error) {
            console.error('予約枠の削除に失敗しました:', error);
        }
    };

    return (
        <div>
            <p>予約枠一覧</p>
            <ul>
                {slots.map(slot => (
                    <li key={slot.id}>
                        {slot.slot_time} - 最大{slot.max_groups}グループ ({slot.max_people}人/グループ)
                        <button onClick={() => handleDelete(slot.id)}>削除</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReservationSlotList;
