// src/components/DateSelectionForm.js

import React, { useState } from 'react';

const DateSelectionForm = ({ onDateSelection }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [cycle, setCycle] = useState('daily');
    const [selectedDays, setSelectedDays] = useState([]);

    // 本日の日付を取得
    const today = new Date().toISOString().split('T')[0];

    // フォームの送信時に選択されたデータを処理
    const handleSubmit = (e) => {
        e.preventDefault();
        onDateSelection({ startDate, endDate, cycle, selectedDays });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                期間（開始日）:
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                        setStartDate(e.target.value);
                        setEndDate(''); // 開始日が変更されたら終了日をリセット
                    }}
                    min={today} // 開始日が本日以降のみ選択可能
                    required
                />
            </label>
            <label>
                期間（終了日）:
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || today} // 終了日は開始日以降のみ選択可能
                    required
                />
            </label>
            <label>
                周期:
                <select value={cycle} onChange={(e) => setCycle(e.target.value)}>
                    <option value="daily">毎日</option>
                    <option value="weekly">毎週</option>
                    <option value="monthly">毎月</option>
                </select>
            </label>
            {cycle === 'weekly' && (
                <div>
                    <label>曜日を選択:</label>
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                        <label key={day}>
                            <input
                                type="checkbox"
                                checked={selectedDays.includes(day)}
                                onChange={() => {
                                    setSelectedDays((prev) =>
                                        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
                                    );
                                }}
                            />
                            {['日', '月', '火', '水', '木', '金', '土'][day]}
                        </label>
                    ))}
                </div>
            )}
            <button type="submit">日付を抽出</button>
        </form>
    );
};

export default DateSelectionForm;
