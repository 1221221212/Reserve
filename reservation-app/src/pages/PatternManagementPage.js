// src/pages/PatternManagementPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { removeSecond } from '../utils/utils';
import '../styles/Pattern.scss';

const PatternManagementPage = () => {
    const [patterns, setPatterns] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

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

    const handleCreatePattern = () => {
        navigate('/admin/slots/patterns/create');
    };

    const handleClosePattern = async (id) => {
        if (!window.confirm('このパターンを受付停止にしますか？')) {
            return;
        }
    
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            await axios.patch(`${apiUrl}/patterns/${id}/close`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('パターンが受付停止になりました');
            // ページをリフレッシュ
            window.location.reload();
        } catch (error) {
            console.error('パターンの受付停止に失敗しました:', error);
            alert('パターンの受付停止に失敗しました');
        }
    };

    return (
        <div className="admin-page-content">
            <button className="button" onClick={handleCreatePattern}>パターンを作成</button>
            <table className="pattern-table">
                <thead>
                    <tr>
                        <th>パターン名</th>
                        <th>開始時間</th>
                        <th>終了時間</th>
                        <th>最大組数</th>
                        <th>最大人数</th>
                        <th></th>
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
                            <td>
                                <button className="delete-button" onClick={() => handleClosePattern(pattern.id)}>
                                    受付停止
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatternManagementPage;
