import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { removeSecond } from '../utils/dateUtils';

const SlotSelection = ({ selectedDate, onSlotSelect }) => {
    const [slots, setSlots] = useState([]);
    const [availabilityInfo, setAvailabilityInfo] = useState({});

    // スロット情報を取得
    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/availability/day`, {
                    params: { date: selectedDate }
                });
                setSlots(response.data);
            } catch (error) {
                console.error("スロットの取得に失敗しました:", error);
            }
        };

        fetchSlots();
    }, [selectedDate]);

    // 現在の予約人数を取得
    useEffect(() => {
        const fetchAvailabilityInfo = async () => {
            if (slots.length === 0) return;  // スロットがまだ取得されていない場合は実行しない

            try {
                const slotIds = slots.map(slot => slot.id);  // 各スロットのIDを取得
                const responses = await Promise.all(
                    slotIds.map(id =>
                        axios.get(`${process.env.REACT_APP_API_URL}/api/availability/current-reservation-count`, {
                            params: { slotId: id }
                        })
                    )
                );

                // 各スロットの予約人数情報を取得してセット
                const info = responses.reduce((acc, response, index) => {
                    acc[slotIds[index]] = response.data.count;
                    return acc;
                }, {});
                setAvailabilityInfo(info);
            } catch (error) {
                console.error("空き状況の取得に失敗しました:", error);
            }
        };

        fetchAvailabilityInfo();
    }, [slots]);

    const renderSlotInfo = (slot) => {
        const { id, max_groups, max_people, availability } = slot;
        const currentCount = availabilityInfo[id] || 0;

        // availabilityが0でない場合は予約不可と表示
        if (availability !== '0') {
            return "予約不可";
        }

        // 最大組数が設定されている場合と設定されていない場合で表示内容を分ける
        if (max_groups) {
            return `最大 ${max_people} 人`;
        } else {
            const remainingPeople = max_people - currentCount;
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
