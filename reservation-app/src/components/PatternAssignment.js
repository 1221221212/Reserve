import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { removeSecond } from '../utils/utils';
import '../styles/Pattern.scss';

const PatternAssignment = ({ selectedDates, closedDates, onPatternSelect }) => {
    const [patterns, setPatterns] = useState([]);
    const [selectedPatterns, setSelectedPatterns] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPatterns = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/patterns`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPatterns(response.data);
            } catch (error) {
                console.error("パターンの取得に失敗しました:", error);
            }
        };
        fetchPatterns();
    }, [token]);

    const togglePatternSelection = (pattern) => {
        setSelectedPatterns((prev) =>
            prev.includes(pattern)
                ? prev.filter((p) => p.id !== pattern.id)
                : [...prev, pattern]
        );
    };

    const handleNext = () => {
        onPatternSelect(selectedPatterns);
    };

    return (
        <div className="pattern-assignment">
            <p>パターンの割り当て</p>
            <p>以下の日付は休業日のため予約枠が作成されません！</p>
            <ul className="date-list close">
                {closedDates.map((date, index) => (
                    <li key={index}>{new Date(date).toLocaleDateString()}</li>
                ))}
            </ul>

            <p>以下の日付に割り当てるパターンを選択してください。</p>
            <ul className="date-list">
                {selectedDates.map((date, index) => (
                    <li key={index}>{new Date(date).toLocaleDateString()}</li>
                ))}
            </ul>
            <p>利用可能なパターン</p>
            <ul className="pattern-list">
                {patterns.map((pattern) => (
                    <li
                        key={pattern.id}
                        className={`pattern-item ${selectedPatterns.includes(pattern) ? 'selected' : ''}`}
                        onClick={() => togglePatternSelection(pattern)}
                    >
                        {removeSecond(pattern.start_time)} から {removeSecond(pattern.end_time)}
                        {pattern.max_groups !== null ? (
                            <> (最大 {pattern.max_groups} 組, 各組 {pattern.max_people} 人)</>
                        ) : (
                            <> (最大 {pattern.max_people} 人)</>
                        )}
                    </li>
                ))}

            </ul>
            <button onClick={handleNext} disabled={selectedPatterns.length === 0} className="button">次へ</button>
        </div>
    );
};

export default PatternAssignment;
