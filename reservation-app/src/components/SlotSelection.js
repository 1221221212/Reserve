import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/slotSelection.scss';

const SlotSelection = ({ selectedDate, onSlotSelect }) => {
    const [slots, setSlots] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/availability/day`, {
                    params: { date: selectedDate }
                });
                setSlots(response.data);
            } catch (error) {
                console.error("予約枠の取得に失敗しました:", error);
                alert("予約枠の取得に失敗しました。");
            }
        };

        if (selectedDate) {
            fetchSlots();
        }
    }, [selectedDate, apiUrl]);

    return (
        <div className="slot-selection">
            <h3>予約枠を選択してください</h3>
            <ul>
                {slots.map((slot) => (
                    <li
                        key={slot.pattern_id}
                        onClick={() => slot.availability === '0' && onSlotSelect(slot)}
                        style={{
                            cursor: slot.availability === '0' ? 'pointer' : 'not-allowed',
                            color: slot.availability === '0' ? 'black' : 'gray',
                        }}
                    >
                        {slot.slot_time} - {slot.availability === '0' ? '〇' : '✕'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SlotSelection;
