// src/components/SlotConfirmation.js
import React from 'react';
import axios from 'axios';
import { removeSecond } from '../utils/utils';
import '../styles/Slot.scss';

const SlotConfirmation = ({ selectedDates, selectedPatterns, onConfirm }) => {
    const handleConfirm = async () => {
        try {
            const token = localStorage.getItem('token');

            await axios.post(`${process.env.REACT_APP_API_URL}/assigned-slots`, {
                dates: selectedDates,
                patterns: selectedPatterns,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("予約枠が作成されました");
            onConfirm();
        } catch (error) {
            console.error("予約枠の作成に失敗しました:", error);
            alert("予約枠の作成に失敗しました");
        }
    };

    return (
        <div className="slot-confirmation">
            <p>確認画面</p>
            <p>選択された日付:</p>
            <ul className="date-list">
                {selectedDates.map((date, index) => (
                    <li key={index}>{new Date(date).toLocaleDateString()}</li>
                ))}
            </ul>
            <p>割り当てられるパターン:</p>
            <ul className="pattern-list">
                {selectedPatterns.map((pattern, index) => (
                    <li key={index}>
                        {removeSecond(pattern.start_time)} から {removeSecond(pattern.end_time)} 
                        {pattern.max_groups !== null ? (
                            <> (最大 {pattern.max_groups} 組, 各組 {pattern.max_people} 人)</>
                        ) : (
                            <> (最大 {pattern.max_people} 人)</>
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={handleConfirm} className="confirm-button">確認して予約枠を作成</button>
        </div>
    );
};

export default SlotConfirmation;
