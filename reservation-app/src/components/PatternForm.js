// src/components/PatternForm.js
import React, { useState } from 'react';
import axios from 'axios';

const PatternForm = ({ onPatternSaved }) => {
    const token = localStorage.getItem('token');
    const [patternName, setPatternName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [maxGroups, setMaxGroups] = useState(1);
    const [maxPeople, setMaxPeople] = useState(1);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            await axios.post(`${apiUrl}/patterns`, {
                pattern_name: patternName,
                start_time: startTime,
                end_time: endTime,
                max_groups: maxGroups,
                max_people: maxPeople,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            alert('パターンが保存されました');
            onPatternSaved();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message); // 重複エラーのメッセージを表示
            } else {
                console.error('パターンの保存に失敗しました:', error);
                alert('パターンの保存に失敗しました');
            }
        }
    };

    return (
        <div className="pattern-form-container">
            <form onSubmit={handleSubmit} className="pattern-form">
                <div className="form-group">
                    <label>パターン名:</label>
                    <input
                        type="text"
                        value={patternName}
                        onChange={(e) => setPatternName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>開始時間:</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>終了時間:</label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>最大組数:</label>
                    <input
                        type="number"
                        value={maxGroups}
                        onChange={(e) => setMaxGroups(parseInt(e.target.value, 10))}
                    />
                </div>
                <div className="form-group">
                    <label>一組あたりの最大人数:</label>
                    <input
                        type="number"
                        value={maxPeople}
                        onChange={(e) => setMaxPeople(parseInt(e.target.value, 10))}
                        min="1"
                        required
                    />
                </div>
                <button type="submit" className="button">パターンを保存</button>
            </form>
        </div>
    );
};

export default PatternForm;
