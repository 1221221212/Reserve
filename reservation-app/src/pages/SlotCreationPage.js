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
            return response.data; // 祝日データを返す
        } catch (error) {
            console.error('祝日データの取得に失敗しました:', error);
            alert("祝日データの取得に失敗しました");
            return [];
        }
    };

    const handleDateSelection = async ({ startDate, endDate, cycle, selectedDays }) => {
        // fetchHolidays関数で祝日データを取得して、ローカル変数に格納
        const fetchedHolidays = await fetchHolidays(startDate, endDate);
        setHolidays(fetchedHolidays); // 祝日データを状態に保存
    
        // 取得した祝日データを使って日付を抽出およびフィルタリング
        const extractedDates = extractDates(new Date(startDate), new Date(endDate), cycle, selectedDays);
        const filteredDates = filterDates(extractedDates, fetchedHolidays, holidayOption); // ここで即座に祝日データを使う
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
            <h1>予約枠作成</h1>
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
