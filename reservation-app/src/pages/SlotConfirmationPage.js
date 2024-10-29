import React from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const SlotConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedDates, selectedPatterns } = location.state || { selectedDates: [], selectedPatterns: [] };

    const handleConfirm = async () => {
        try {
            // API エンドポイントに POST リクエストを送信
            await axios.post(`${process.env.REACT_APP_API_URL}/api/slots/create`, {
                dates: selectedDates,
                patterns: selectedPatterns,
            });
            alert("予約枠が作成されました");
            navigate('/admin'); // 作成完了後に管理画面へ遷移
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
                    <li key={index}>{date}</li>
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

export default SlotConfirmationPage;
