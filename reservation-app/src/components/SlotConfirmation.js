// src/components/SlotConfirmation.js
import React from 'react';
import axios from 'axios';

const SlotConfirmation = ({ selectedDates, selectedPatterns, onConfirm }) => {
    const handleConfirm = async () => {
        try {
            const token = localStorage.getItem('token'); // ローカルストレージからトークンを取得

            // API エンドポイントに POST リクエストを送信
            await axios.post(`${process.env.REACT_APP_API_URL}/api/assigned-slots`, {
                dates: selectedDates,
                patterns: selectedPatterns,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // トークンをヘッダーに追加
                },
            });

            alert("予約枠が作成されました");
            onConfirm(); // 確認後のコールバックを実行
        } catch (error) {
            console.error("予約枠の作成に失敗しました:", error);
            alert("予約枠の作成に失敗しました");
        }
    };

    return (
        <div>
            <h2>確認画面</h2>
            <h3>選択された日付:</h3>
            <ul>
                {selectedDates.map((date, index) => (
                    <li key={index}>{new Date(date).toLocaleDateString()}</li>
                ))}
            </ul>
            <h3>割り当てられるパターン:</h3>
            <ul>
                {selectedPatterns.map((pattern, index) => (
                    <li key={index}>
                        {pattern.name} - {pattern.start_time} から {pattern.end_time} (最大 {pattern.max_groups} 組, 各組 {pattern.max_people_per_group} 人)
                    </li>
                ))}
            </ul>
            <button onClick={handleConfirm}>確認して予約枠を作成</button>
        </div>
    );
};

export default SlotConfirmation;
