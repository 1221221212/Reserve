import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { removeSecond } from '../utils/utils';

const AdminSlotSelection = ({ selectedDate, onSlotSelect, selectedSlot }) => {
    const [slots, setSlots] = useState([]);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const token = localStorage.getItem('token'); // トークンを取得
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/assigned-slots/day`, {
                    params: { date: selectedDate },
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSlots(response.data);
            } catch (error) {
                console.error("スロット情報の取得に失敗しました:", error);
            }
        };

        if (selectedDate) {
            fetchSlots();
        }
    }, [selectedDate]);

    const handleSlotClick = (slot) => {
        onSlotSelect(slot); // 親コンポーネントに選択されたスロットを通知
    };

    return (
        <div className="admin-slot-selection">
            <p>{selectedDate} のスロット一覧</p>
            <ul className="slot-list">
                {slots.map((slot) => (
                    <li
                        key={slot.id}
                        className={`slot-item ${slot.reservation_count > 0 ? 'reserved' : 'non-reserved'} ${slot.status} ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                        onClick={() => handleSlotClick(slot)} // スロットをクリックした際の処理
                    >
                        <div className="slot-time">
                            {removeSecond(slot.start_time)} - {removeSecond(slot.end_time)}
                        </div>
                        <div className="slot-info">
                            {`${slot.reservation_count}件 - ${slot.status}`}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminSlotSelection;
