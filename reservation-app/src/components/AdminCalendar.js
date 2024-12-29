import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';

const AdminCalendar = ({ onDateSelect, selectedDate }) => {
    const [dates, setDates] = useState([]);
    const [closedDays, setClosedDays] = useState([]);
    const [slotDays, setSlotDays] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [displayedMonth, setDisplayedMonth] = useState(moment().tz('Asia/Tokyo'));

    const initializeCalendar = () => {
        const monthDates = [];
        const year = displayedMonth.year();
        const month = displayedMonth.month();

        const firstDay = moment([year, month, 1]).day();
        const daysInMonth = displayedMonth.daysInMonth();

        for (let i = 0; i < firstDay; i++) {
            monthDates.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            monthDates.push(moment([year, month, day]).tz('Asia/Tokyo').format('YYYY-MM-DD'));
        }

        setDates(monthDates);
    };

    const handlePrevMonth = () => {
        setDisplayedMonth(displayedMonth.clone().subtract(1, 'months'));
        setIsDataLoaded(false); // 月変更時にデータ取得フラグをリセット
    };

    const handleNextMonth = () => {
        setDisplayedMonth(displayedMonth.clone().add(1, 'months'));
        setIsDataLoaded(false); // 月変更時にデータ取得フラグをリセット
    };

    useEffect(() => {
        initializeCalendar();

        const year = displayedMonth.year();
        const month = displayedMonth.month() + 1;

        const start_date = moment([year, month - 1, 1]).startOf('month').format('YYYY-MM-DD');
        const end_date = moment([year, month - 1, 1]).endOf('month').format('YYYY-MM-DD');

        const token = localStorage.getItem('token'); // ローカルストレージからトークンを取得

        const fetchData = async () => {
            try {
                const [closedDaysResponse, slotsResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/closed-days/range`, { 
                        params: { start_date, end_date },
                    }),
                    axios.get(`${process.env.REACT_APP_API_URL}/assigned-slots/month`, { 
                        params: { year, month },
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
        
                // データの存在確認とデフォルト値の設定
                const closedDays = closedDaysResponse?.data || [];
                const slots = slotsResponse?.data || [];
        
                setClosedDays(
                    closedDays.map(day => ({
                        ...day,
                        date: moment(day.date).format('YYYY-MM-DD'),
                    }))
                );
        
                setSlotDays(
                    slots.map(slot => ({
                        ...slot,
                        date: moment(slot.date).format('YYYY-MM-DD'),
                    }))
                );
        
                setIsDataLoaded(true); // データ取得完了
            } catch (error) {
                console.error("データ取得に失敗しました:", error);
                setIsDataLoaded(true); // エラー時もロードフラグを更新
            }
        };
        

        fetchData();
    }, [displayedMonth]);

    const getDayDetails = (date) => {
        if (!date) return { text: '', className: 'empty' };

        const isClosedDay = closedDays.some((closedDay) => closedDay.date === date);
        if (isClosedDay) {
            return { text: '休', className: 'close' };
        }

        const slotData = slotDays.find((slot) => slot.date === date);
        if (!slotData?.has_slots) {
            return { text: '枠なし', className: 'no-slot' };
        }

        const reservationCount = slotData.reservation_count || 0;

        if (reservationCount === 0) {
            return { text: '0件', className: 'non-reserved' };
        }
        return { text: `${reservationCount}件`, className: 'reserved' };
    };

    return (
        <div className="admin-calendar">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>＜</button>
                <span>{displayedMonth.format('MMMM YYYY')}</span>
                <button onClick={handleNextMonth}>＞</button>
            </div>
            <div className="calendar-grid">
                {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                    <div key={index} className="calendar-day">{day}</div>
                ))}
                {isDataLoaded ? (
                    dates.map((date, index) => {
                        const { text, className } = getDayDetails(date);

                        return (
                            <div
                                key={index}
                                className={`calendar-date ${className} ${date === selectedDate ? 'selected' : ''}`}
                                onClick={() => date && onDateSelect(date)}
                            >
                                {date && moment(date).date()}
                                <span className="reservation-count">{text}</span>
                            </div>
                        );
                    })
                ) : (
                    <div className="loading">データをロード中...</div>
                )}
            </div>
        </div>
    );
};

export default AdminCalendar;
