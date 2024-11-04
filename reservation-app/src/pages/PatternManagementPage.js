// src/pages/PatternManagementPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { removeSecond } from '../utils/dateUtils';
import '../styles/PatternManagement.scss';

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
        <div className="admin-page-content">
            <h1>パターン管理</h1>
            <button className="button" onClick={handleCreatePattern}>パターンを作成</button>
            <table className="pattern-table">
                <thead>
                    <tr>
                        <th>パターン名</th>
                        <th>開始時間</th>
                        <th>終了時間</th>
                        <th>最大組数</th>
                        <th>各組の最大人数</th>
                    </tr>
                </thead>
                <tbody>
                    {patterns.map((pattern) => (
                        <tr key={pattern.id}>
                            <td>{pattern.pattern_name}</td>
                            <td>{removeSecond(pattern.start_time)}</td>
                            <td>{removeSecond(pattern.end_time)}</td>
                            <td>{pattern.max_groups ?? "ー"}</td>
                            <td>{pattern.max_people}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatternManagementPage;
