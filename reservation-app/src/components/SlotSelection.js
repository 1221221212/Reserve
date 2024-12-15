import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { removeSecond } from '../utils/utils';

const SlotSelection = ({ selectedDate, availableSince, availableUntil, availableSinceTime, onSlotSelect }) => {
    const [slots, setSlots] = useState([]);
    const [availabilityInfo, setAvailabilityInfo] = useState({});

    // スロット情報を取得
    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const today = new Date().toISOString().split('T')[0]; // 今日の日付 (YYYY-MM-DD形式)

                const params = {
                    date: selectedDate,
                    available_since: availableSince,
                    available_until: availableUntil,
                };

                // 選択された日付が今日の場合に `available_since_time` を追加
                if (selectedDate === today && availableSinceTime) {
                    params.available_since_time = availableSinceTime;
                }

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/availability/day`, {
                    params,
                });
                setSlots(response.data);
            } catch (error) {
                console.error("スロットの取得に失敗しました:", error);
            }
        };

        fetchSlots();
    }, [selectedDate]);

    const renderSlotInfo = (slot) => {
        const { id, max_groups, max_people, availability, reservation_count, current_people } = slot;

        if (availability !== '0') {
            return "予約不可";
        }

        if (max_groups) {
            const remainingGroups = max_groups - reservation_count;
            return `残り${remainingGroups}組予約可能`;
        } else {
            const remainingPeople = max_people - current_people;
            return `残り ${remainingPeople} 人予約可能`;
        }
    };

    return (
        <div className="slot-selection">
            <p className="selectedDate">{selectedDate}</p>
            <ul>
                {slots.map((slot) => (
                    <li
                        key={slot.id}
                        onClick={() => slot.availability === '0' && onSlotSelect(slot)}
                        className={slot.availability === '0' ? 'selectable' : 'not-selectable'}
                        style={{ cursor: slot.availability === '0' ? 'pointer' : 'not-allowed' }}
                    >
                        <div>
                            {removeSecond(slot.start_time)} - {removeSecond(slot.end_time)}
                        </div>
                        <div>{renderSlotInfo(slot)}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SlotSelection;
