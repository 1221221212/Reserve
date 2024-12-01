import React, { useState } from 'react';
import DateSelectionForm from '../components/DateSelectionForm';
import PatternAssignment from '../components/PatternAssignment';
import SlotConfirmation from '../components/SlotConfirmation';

const SlotCreationPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedPatterns, setSelectedPatterns] = useState([]);

    const handleDateSelection = ({ filteredDates }) => {
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
                <DateSelectionForm onDateSelection={handleDateSelection} />
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
                <button className="back-button" onClick={() => setCurrentStep(currentStep - 1)}>
                    戻る
                </button>
            )}
        </div>
    );
};

export default SlotCreationPage;
