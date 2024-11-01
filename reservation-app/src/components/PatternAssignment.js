// src/components/PatternAssignment.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatternAssignment = ({ selectedDates, onPatternSelect }) => {
    const [patterns, setPatterns] = useState([]);
    const [selectedPatterns, setSelectedPatterns] = useState([]);
    const token = localStorage.getItem('token'); // ローカルストレージからトークンを取得

    // パターン一覧の取得
    useEffect(() => {
        const fetchPatterns = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/patterns`, {
                    headers: { Authorization: `Bearer ${token}` } // 認証ヘッダーを追加
                });
                setPatterns(response.data);
            } catch (error) {
                console.error("パターンの取得に失敗しました:", error);
            }
        };
        fetchPatterns();
    }, [token]);

    // パターンの選択切り替え
    const togglePatternSelection = (pattern) => {
        setSelectedPatterns((prev) =>
            prev.includes(pattern)
                ? prev.filter((p) => p.id !== pattern.id)
                : [...prev, pattern]
        );
    };

    // パターン選択を親コンポーネントに伝える
    const handleNext = () => {
        onPatternSelect(selectedPatterns);
    };

    return (
        <div>
            <h2>パターンの割り当て</h2>
            <p>以下の日付に割り当てるパターンを選択してください。</p>
            <ul>
                {selectedDates.map((date, index) => (
                    <li key={index}>{new Date(date).toLocaleDateString()}</li>
                ))}
            </ul>
            <h3>利用可能なパターン</h3>
            <ul>
                {patterns.map((pattern) => (
                    <li key={pattern.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedPatterns.includes(pattern)}
                                onChange={() => togglePatternSelection(pattern)}
                            />
                            {pattern.name} - {pattern.start_time} から {pattern.end_time} 
                            (最大 {pattern.max_groups} 組, 各組 {pattern.max_people_per_group} 人)
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={handleNext} disabled={selectedPatterns.length === 0}>次へ</button>
        </div>
    );
};

export default PatternAssignment;
