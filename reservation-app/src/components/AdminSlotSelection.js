import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminSlotSelection = ({ selectedDate, onSlotSelect }) => {
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
        <div className="slot-selection">
            <h3>{selectedDate} のスロット一覧</h3>
            <ul className="slot-list">
                {slots.map((slot) => (
                    <li
                        key={slot.id}
                        className={`slot-item ${slot.reservation_count > 0 ? 'reserved' : 'non-reserved'} ${slot.status}`}
                        onClick={() => handleSlotClick(slot)} // スロットをクリックした際の処理
                    >
                        <div className="slot-time">
                            {slot.start_time} - {slot.end_time}
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
