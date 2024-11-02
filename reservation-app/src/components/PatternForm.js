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
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
            await axios.post(`${apiUrl}/api/patterns`, {
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
            console.error('パターンの保存に失敗しました:', error);
        }
    };

    return (
        <div className="pattern-form-container">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>パターン名:</label>
                    <input
                        type="text"
                        value={patternName}
                        onChange={(e) => setPatternName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>開始時間:</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>終了時間:</label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>最大組数:</label>
                    <input
                        type="number"
                        value={maxGroups}
                        onChange={(e) => setMaxGroups(parseInt(e.target.value, 10))}
                    />
                </div>
                <div>
                    <label>一組あたりの最大人数:</label>
                    <input
                        type="number"
                        value={maxPeople}
                        onChange={(e) => setMaxPeople(parseInt(e.target.value, 10))}
                        min="1"
                        required
                    />
                </div>
                <button type="submit">パターンを保存</button>
            </form>
        </div>
    );
};

export default PatternForm;