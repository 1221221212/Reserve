import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import DateSelectionForm from '../components/DateSelectionForm';
import PatternAssignment from '../components/PatternAssignment';
import SlotConfirmation from '../components/SlotConfirmation';

const SlotCreationPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedDates, setSelectedDates] = useState([]);
    const [closedDates, setClosedDates] = useState([]);
    const [selectedPatterns, setSelectedPatterns] = useState([]);
    const navigate = useNavigate();

    const handleDateSelection = ({ filteredDates, closedDates }) => {
        setSelectedDates(filteredDates);
        setClosedDates(closedDates);
        setCurrentStep(2);
    };

    const handlePatternSelection = (patterns) => {
        setSelectedPatterns(patterns);
        setCurrentStep(3);
    };

    const handleConfirmation = () => {
        setSelectedDates([]);
        setSelectedPatterns([]);
        navigate('/admin/slots');
    };

    return (
        <div>
            <h1>予約枠作成</h1>
            {currentStep === 1 && (
                <DateSelectionForm onDateSelection={handleDateSelection} />
            )}
            {currentStep === 2 && (
                <PatternAssignment
                    selectedDates={selectedDates}
                    closedDates={closedDates}
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
                <button className="back-button" onClick={() => setCurrentStep(currentStep - 1)}>
                    戻る
                </button>
            )}
        </div>
    );
};

export default SlotCreationPage;
