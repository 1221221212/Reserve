// src/components/Calendar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calendar = ({ onDateSelect }) => {
    const [dates, setDates] = useState([]);
    const [reservations, setReservations] = useState([]);
    const today = new Date();

    // カレンダーの初期化処理
    const initializeCalendar = () => {
        const monthDates = [];
        const year = today.getFullYear();
        const month = today.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            monthDates.push(null); // 空白日を追加
        }

        for (let day = 1; day <= daysInMonth; day++) {
            monthDates.push(new Date(year, month, day));
        }

        setDates(monthDates);
    };

    // データ取得とカレンダー初期化
    useEffect(() => {
        initializeCalendar();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;

        const fetchReservationsForMonth = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/availability/month`, {
                    params: { year, month }
                });
                setReservations(response.data);
            } catch (error) {
                console.error("予約データの取得に失敗しました:", error);
            }
        };

        fetchReservationsForMonth();
    }, []);

    // 日付ごとの○×判定
    const getReservationStatus = (date) => {
        if (!date) return '';
        const reservation = reservations.find(
            (res) => new Date(res.date).toDateString() === date.toDateString()
        );
        return reservation ? (reservation.availability === '0' ? '〇' : '✕') : '-';
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
            <div className="calendar-grid">
                {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                    <div key={index} className="calendar-day">{day}</div>
                ))}
                {dates.map((date, index) => (
                    <div
                        key={index}
                        className={`calendar-date ${!date ? 'empty' : ''}`}
                        onClick={() => date && onDateSelect(date)}
                    >
                        {date && date.getDate()}
                        <span className="reservation-status">{getReservationStatus(date)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
