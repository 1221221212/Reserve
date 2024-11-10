import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { removeSecond } from '../utils/dateUtils';
import '../styles/PatternAssignment.scss';

const PatternAssignment = ({ selectedDates, onPatternSelect }) => {
    const [patterns, setPatterns] = useState([]);
    const [selectedPatterns, setSelectedPatterns] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPatterns = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/patterns`, {
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
            <h2>パターンの割り当て</h2>
            <p>以下の日付に割り当てるパターンを選択してください。</p>
            <ul className="date-list">
                {selectedDates.map((date, index) => (
                    <li key={index}>{new Date(date).toLocaleDateString()}</li>
                ))}
            </ul>
            <h3>利用可能なパターン</h3>
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
