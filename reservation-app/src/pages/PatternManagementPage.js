// src/pages/PatternManagementPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { removeSecond } from '../utils/dateUtils';

const PatternManagementPage = () => {
    const [patterns, setPatterns] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

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

    const handleCreatePattern = () => {
        navigate('/admin/patterns/create');
    };

    return (
        <div>
            <h1>パターン管理</h1>
            <button onClick={handleCreatePattern}>パターンを作成</button>
            <ul>
                {patterns.map((pattern) => (
                    <li key={pattern.id}>
                        {pattern.pattern_name} - {removeSecond(pattern.start_time)} から {removeSecond(pattern.end_time)}
                        （最大組数: {pattern.max_groups ?? "ー"}, 各組の最大人数: {pattern.max_people}）
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PatternManagementPage;
