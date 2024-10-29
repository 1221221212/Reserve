// src/pages/DateSelectionPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DateSelectionForm from '../components/DateSelectionForm';
import HolidayCheck from '../components/HolidayCheck';
import DatePreview from '../components/DatePreview';
import { extractDates, filterDates } from '../utils/dateUtils';
import axios from 'axios';

const DateSelectionPage = () => {
    const [dates, setDates] = useState([]);
    const [holidayOption, setHolidayOption] = useState('Include');
    const [holidays, setHolidays] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchHolidays = async (startDate, endDate) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/holidays`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { startDate, endDate }
            });
            setHolidays(response.data);
        } catch (error) {
            console.error('祝日データの取得に失敗しました:', error);
        }
    };

    const handleDateSelection = async ({ startDate, endDate, cycle, selectedDays }) => {
        const extractedDates = extractDates(new Date(startDate), new Date(endDate), cycle, selectedDays);
        await fetchHolidays(startDate, endDate);
        const filteredDates = filterDates(extractedDates, holidays, holidayOption);
        setDates(filteredDates);

        navigate('/assign-pattern', { state: { dates: filteredDates } });
    };

    return (
        <div>
            <h1>日付を選択</h1>
            <DateSelectionForm onDateSelection={handleDateSelection} />
            <HolidayCheck holidayOption={holidayOption} setHolidayOption={setHolidayOption} />
            <DatePreview dates={dates} />
        </div>
    );
};

export default DateSelectionPage;