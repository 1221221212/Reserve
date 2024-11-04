// src/components/DateSelectionForm.js

import React, { useState } from 'react';
import axios from 'axios';
import HolidayCheck from './HolidayCheck';
import { extractDates, filterDates } from '../utils/dateUtils';
import '../styles/DateSelectionForm.scss';

const DateSelectionForm = ({ onDateSelection }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [cycle, setCycle] = useState('daily');
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedDatesInMonth, setSelectedDatesInMonth] = useState([]);
    const [holidayOption, setHolidayOption] = useState('Include');

    const today = new Date().toISOString().split('T')[0];

    const fetchHolidays = async (startDate, endDate) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/holidays`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            console.error('祝日データの取得に失敗しました:', error);
            alert("祝日データの取得に失敗しました");
            return [];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const extractedDates = extractDates(new Date(startDate), new Date(endDate), cycle, cycle === 'monthly' ? selectedDatesInMonth : selectedDays);
        
        const fetchedHolidays = await fetchHolidays(startDate, endDate);
        const filteredDates = filterDates(extractedDates, fetchedHolidays, holidayOption);
        
        onDateSelection({ filteredDates });
    };

    const toggleDay = (day) => {
        setSelectedDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
    };

    const toggleDateInMonth = (date) => {
        setSelectedDatesInMonth((prev) => prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]);
    };

    return (
        <form onSubmit={handleSubmit} className="date-selection-form">
            <div className="form-group">
                <label>期間（開始日）:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                        setStartDate(e.target.value);
                        setEndDate('');
                    }}
                    min={today}
                    required
                />
            </div>
            <div className="form-group">
                <label>期間（終了日）:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || today}
                    required
                />
            </div>
            <div className="form-group">
                <label>周期:</label>
                <select value={cycle} onChange={(e) => setCycle(e.target.value)}>
                    <option value="daily">毎日</option>
                    <option value="weekly">毎週</option>
                    <option value="monthly">毎月</option>
                </select>
            </div>

            {cycle === 'weekly' && (
                <div className="form-group days-selection">
                    <label>曜日を選択:</label>
                    <div className="selection-grid">
                        {['日', '月', '火', '水', '木', '金', '土'].map((dayLabel, day) => (
                            <button
                                type="button"
                                key={day}
                                className={`day-button ${selectedDays.includes(day) ? 'selected' : ''}`}
                                onClick={() => toggleDay(day)}
                            >
                                {dayLabel}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {cycle === 'monthly' && (
                <div className="form-group days-selection">
                    <label>日付を選択:</label>
                    <div className="selection-grid">
                        {[...Array(31)].map((_, day) => (
                            <button
                                type="button"
                                key={day + 1}
                                className={`day-button ${selectedDatesInMonth.includes(day + 1) ? 'selected' : ''}`}
                                onClick={() => toggleDateInMonth(day + 1)}
                            >
                                {day + 1}日
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <HolidayCheck holidayOption={holidayOption} setHolidayOption={setHolidayOption} />
            <button type="submit" className="button">日付を抽出</button>
        </form>
    );
};

export default DateSelectionForm;
