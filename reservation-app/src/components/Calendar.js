import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import '../styles/calendar.scss';

const Calendar = ({ onDateSelect, availableSince, availableSinceTime, availableUntil }) => {
    const [dates, setDates] = useState([]);
    const [reservations, setReservations] = useState([]);
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
    };

    const handleNextMonth = () => {
        setDisplayedMonth(displayedMonth.clone().add(1, 'months'));
    };

    useEffect(() => {
        initializeCalendar();
        const year = displayedMonth.year();
        const month = displayedMonth.month() + 1;

        const fetchReservationsForMonth = async () => {
            try {
                const params = {
                    year,
                    month,
                    available_since: availableSince,
                    available_until: availableUntil,
                };

                if (availableSinceTime) {
                    params.available_since_time = availableSinceTime;
                }

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/availability/month`, { params });
                setReservations(response.data);
            } catch (error) {
                console.error("予約データの取得に失敗しました:", error);
            }
        };


        fetchReservationsForMonth();
    }, [displayedMonth, availableSince, availableUntil]);

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
                <button onClick={handlePrevMonth}>＜</button>
                <span>{displayedMonth.format('MMMM YYYY')}</span>
                <button onClick={handleNextMonth}>＞</button>
            </div>
            <div className="calendar-grid">
                {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                    <div key={index} className="calendar-day">{day}</div>
                ))}
                {dates.map((date, index) => {
                    const status = getReservationStatus(date);
                    const isSelectable = status !== '-';
                    const statusClass = status === '〇' ? 'status-available' : status === '✕' ? 'status-unavailable' : 'status-none';
                    const className = !date
                        ? 'calendar-date empty'
                        : `calendar-date ${isSelectable ? 'selectable' : 'not-selectable'} ${statusClass}`;

                    return (
                        <div
                            key={index}
                            className={className}
                            onClick={() => isSelectable && date && onDateSelect(date)}
                        >
                            {date && moment(date).date()}
                            <span className="reservation-status">{status}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
