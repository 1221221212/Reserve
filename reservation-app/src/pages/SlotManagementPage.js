// src/pages/SlotManagementPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { removeSecond } from '../utils/dateUtils';
import '../styles/SlotManagement.scss';

const SlotManagementPage = () => {
    const [assignedSlots, setAssignedSlots] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchAssignedSlots = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/assigned-slots`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAssignedSlots(response.data);
            } catch (error) {
                console.error('予約枠データの取得に失敗しました:', error);
            }
        };
        fetchAssignedSlots();
    }, [token, apiUrl]);

    return (
        <div className="slot-management-page">
            <h1>予約枠管理</h1>
            <button className="button" onClick={() => navigate('/admin/slots/create')}>予約枠を作成</button>
            <table className="slot-table">
                <thead>
                    <tr>
                        <th>日付</th>
                        <th>開始時間</th>
                        <th>終了時間</th>
                        <th>組数</th>
                        <th>最大人数</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {assignedSlots.map((slot, index) => (
                        <tr key={index}>
                            <td>{slot.date}</td>
                            <td>{removeSecond(slot.start_time)}</td>
                            <td>{removeSecond(slot.end_time)}</td>
                            <td>{slot.max_groups || 'なし'}</td>
                            <td>{slot.max_people}</td>
                            <td>
                                <button className="edit-button">編集</button>
                                <button className="delete-button">削除</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SlotManagementPage;
