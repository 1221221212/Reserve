import React, { useState } from 'react';
import axios from 'axios';
import DateSelectionForm from '../components/DateSelectionForm';
import HolidayCheck from '../components/HolidayCheck';
import PatternAssignment from '../components/PatternAssignment';
import SlotConfirmation from '../components/SlotConfirmation';
import { extractDates, filterDates } from '../utils/dateUtils';

const SlotCreationPage = () => {
    const [currentStep, setCurrentStep] = useState(1); // 現在のステップを追跡
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedPatterns, setSelectedPatterns] = useState([]);
    const [holidayOption, setHolidayOption] = useState('Include');
    const [holidays, setHolidays] = useState([]);

    const fetchHolidays = async (startDate, endDate) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/holidays`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { startDate, endDate }
            });
            setHolidays(response.data);
        } catch (error) {
            console.error('祝日データの取得に失敗しました:', error);
            alert("祝日データの取得に失敗しました");
        }
    };

    const handleDateSelection = async ({ startDate, endDate, cycle, selectedDays }) => {
        await fetchHolidays(startDate, endDate);
        const extractedDates = extractDates(new Date(startDate), new Date(endDate), cycle, selectedDays);
        const filteredDates = filterDates(extractedDates, holidays, holidayOption);
        setSelectedDates(filteredDates);
        setCurrentStep(2);
    };

    const handlePatternSelection = (patterns) => {
        setSelectedPatterns(patterns);
        setCurrentStep(3);
    };

    const handleConfirmation = () => {
        setCurrentStep(1);
        setSelectedDates([]);
        setSelectedPatterns([]);
    };

    return (
        <div>
            <h1>予約枠の管理</h1>
            {currentStep === 1 && (
                <>
                    <DateSelectionForm onDateSelection={handleDateSelection} />
                    <HolidayCheck holidayOption={holidayOption} setHolidayOption={setHolidayOption} />
                </>
            )}
            {currentStep === 2 && (
                <PatternAssignment
                    selectedDates={selectedDates}
                    onPatternSelect={handlePatternSelection}
                />
            )}
            {currentStep === 3 && (
                <SlotConfirmation
                    selectedDates={selectedDates}
                    selectedPatterns={selectedPatterns}
                    onConfirm={handleConfirmation}
                />
            )}
            {currentStep > 1 && (
                <button onClick={() => setCurrentStep(currentStep - 1)}>
                    戻る
                </button>
            )}
        </div>
    );
};

export default SlotCreationPage;
