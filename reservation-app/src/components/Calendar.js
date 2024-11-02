import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';

const Calendar = ({ onDateSelect }) => {
    const [dates, setDates] = useState([]);
    const [reservations, setReservations] = useState([]);
    const today = moment().tz('Asia/Tokyo');  // JSTで今日の日付を取得

    // カレンダーの初期化処理
    const initializeCalendar = () => {
        const monthDates = [];
        const year = today.year();
        const month = today.month();

        const firstDay = moment([year, month, 1]).day();
        const daysInMonth = today.daysInMonth();

        for (let i = 0; i < firstDay; i++) {
            monthDates.push(null); // 空白日を追加
        }

        for (let day = 1; day <= daysInMonth; day++) {
            // JST形式の文字列を保持
            monthDates.push(moment([year, month, day]).tz('Asia/Tokyo').format('YYYY-MM-DD'));
        }

        setDates(monthDates);
    };


    // データ取得とカレンダー初期化
    useEffect(() => {
        initializeCalendar();
        const year = today.year();
        const month = today.month() + 1;

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
            (res) => moment(res.date).tz('Asia/Tokyo').isSame(moment(date).tz('Asia/Tokyo'), 'day')
        );
        return reservation ? (reservation.availability === '0' ? '〇' : '✕') : '-';
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                {today.format('MMMM YYYY')}
            </div>
            <div className="calendar-grid">
                {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                    <div key={index} className="calendar-day">{day}</div>
                ))}
                {dates.map((date, index) => (
    <div
        key={index}
        className={`calendar-date ${!date ? 'empty' : ''}`}
        onClick={() => date && onDateSelect(date)} // 日付文字列をそのまま渡す
    >
        {date && moment(date).date()}
        <span className="reservation-status">{getReservationStatus(date)}</span>
    </div>
))}

            </div>
        </div>
    );
};

export default Calendar;
