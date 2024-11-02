// src/pages/SlotManagementPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SlotManagementPage = () => {
    const [assignedSlots, setAssignedSlots] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchAssignedSlots = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/assigned-slots', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAssignedSlots(response.data);
            } catch (error) {
                console.error('予約枠データの取得に失敗しました:', error);
            }
        };
        fetchAssignedSlots();
    }, [token]);

    return (
        <div>
            <h1>予約枠管理</h1>
            <button onClick={() => navigate('/admin/slots/create')}>予約枠を作成</button>
            <table>
                <thead>
                    <tr>
                        <th>日付</th>
                        <th>開始時間</th>
                        <th>終了時間</th>
                        <th>パターン名</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {assignedSlots.map((slot, index) => (
                        <tr key={index}>
                            <td>{slot.date}</td>
                            <td>{slot.startTime}</td>
                            <td>{slot.endTime}</td>
                            <td>{slot.patternName}</td>
                            <td>
                                <button>編集</button>
                                <button>削除</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SlotManagementPage;
