import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CloseManagementPage = () => {
    const [regularClosedDays, setRegularClosedDays] = useState([]);
    const [temporaryClosedDays, setTemporaryClosedDays] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // 作成済み休業日の取得
    useEffect(() => {
        const fetchClosedDays = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/closed-days`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // データをフィルタリング
                const regular = response.data.filter((day) => day.type !== 'temporary');
                const temporary = response.data.filter((day) => day.type === 'temporary');
                setRegularClosedDays(regular);
                setTemporaryClosedDays(temporary);
            } catch (error) {
                console.error('休業日の取得に失敗しました:', error);
            }
        };

        fetchClosedDays();
    }, [token]);

    const handleCreateClosedDay = () => {
        navigate('/admin/slots/close/settings');
    };

    const translateDayOfWeek = (dayOfWeek) => {
        const days = {
            Monday: '月曜日',
            Tuesday: '火曜日',
            Wednesday: '水曜日',
            Thursday: '木曜日',
            Friday: '金曜日',
            Saturday: '土曜日',
            Sunday: '日曜日',
        };
        return days[dayOfWeek] || '不明な曜日';
    };

    const generateDetail = (day) => {
        if (day.type === 'regular_weekly') {
            return `${translateDayOfWeek(day.day_of_week)}`;
        }
        if (day.type === 'regular_monthly') {
            if (day.week_of_month && day.day_of_week) {
                return `第${day.week_of_month}${translateDayOfWeek(day.day_of_week)}`;
            }
            if (day.day_of_month) {
                return day.day_of_month === 99 ? '末日' : `${day.day_of_month}日`;
            }
        }
        if (day.type === 'regular_yearly') {
            return `${day.month_of_year}月${day.day_of_month === 99 ? '末日' : `${day.day_of_month}日`}`;
        }
        return '詳細なし';
    };

    const translateType = (type) => {
        switch (type) {
            case 'regular_weekly':
                return '毎週';
            case 'regular_monthly':
                return '毎月';
            case 'regular_yearly':
                return '毎年';
            case 'temporary':
                return '臨時';
            default:
                return '不明';
        }
    };

    return (
        <div className="admin-page-content">

            {/* ボタンと目次 */}
            <div className="button-and-nav">
                <button className="button" onClick={handleCreateClosedDay}>
                    休業日を設定
                </button>
            </div>

            {/* 定休日一覧 */}
            <section id="regular-closed-days">
                <p>定休日一覧</p>
                <table className="closed-day-table">
                    <thead>
                        <tr>
                            <th>タイプ</th>
                            <th>詳細</th>
                            <th>作成日時</th>
                        </tr>
                    </thead>
                    <tbody>
                        {regularClosedDays.length > 0 ? (
                            regularClosedDays.map((day) => (
                                <tr key={day.id}>
                                    <td>{translateType(day.type)}</td>
                                    <td>{generateDetail(day)}</td>
                                    <td>{new Date(day.created_at).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">データがありません</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>

            {/* 臨時休業日一覧 */}
            <section id="temporary-closed-days">
                <p>臨時休業日一覧</p>
                <table className="closed-day-table">
                    <thead>
                        <tr>
                            <th>日付</th>
                            <th>理由</th>
                            <th>作成日時</th>
                        </tr>
                    </thead>
                    <tbody>
                        {temporaryClosedDays.length > 0 ? (
                            temporaryClosedDays.map((day) => (
                                <tr key={day.id}>
                                    <td>{new Date(day.date).toLocaleDateString()}</td>
                                    <td>{day.reason || 'ー'}</td>
                                    <td>{new Date(day.created_at).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">データがありません</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default CloseManagementPage;
