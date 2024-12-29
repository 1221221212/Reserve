import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { removeSecond } from '../utils/utils';
import '../styles/Slot.scss';

const SlotManagementPage = () => {
    const [assignedSlots, setAssignedSlots] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_API_URL;

    // 予約枠データを取得
    useEffect(() => {
        const fetchAssignedSlots = async () => {
            try {
                const response = await axios.get(`${apiUrl}/assigned-slots`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAssignedSlots(response.data);
            } catch (error) {
                console.error('予約枠データの取得に失敗しました:', error);
            }
        };
        fetchAssignedSlots();
    }, [token, apiUrl]);

    // 予約枠の受付停止処理
    const handleCloseSlot = async (slotId) => {
        const confirmClose = window.confirm('この予約枠を受付停止しますか？');
        if (!confirmClose) return;

        try {
            const response = await axios.put(
                `${apiUrl}/assigned-slots/status`,
                {
                    slotIds: [slotId],
                    status: 'close'
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert(response.data.message);

            // ページをリフレッシュ
            window.location.reload();

        } catch (error) {
            console.error('受付停止に失敗しました:', error);
            alert('受付停止に失敗しました。エラーを確認してください。');
        }
    };

    return (
        <div className="slot-management-page">
            <button className="button" onClick={() => navigate('/admin/slots/create')}>予約枠を作成</button>
            <table className="slot-table">
                <thead>
                    <tr>
                        <th>日付</th>
                        <th>開始時間</th>
                        <th>終了時間</th>
                        <th>組数</th>
                        <th>最大人数</th>
                        <th></th>
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
                                <button
                                    className="delete-button"
                                    onClick={() => handleCloseSlot(slot.id)}
                                    disabled={slot.status === 'close'}
                                >
                                    {slot.status === 'close' ? '停止済み' : '受付停止'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SlotManagementPage;
