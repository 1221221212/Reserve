// src/pages/ReservationPage.js
import React, { useState } from 'react';
import axios from 'axios';
import Calendar from '../components/Calendar';
import SlotSelection from '../components/SlotSelection';
import ReservationForm from '../components/ReservationForm';
import ReservationConfirmation from '../components/ReservationConfirmation';
import '../styles/reservationCommon.scss';
import '../styles/reservationPage.scss';

const ReservationPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reservationInfo, setReservationInfo] = useState({});

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setCurrentStep(2);
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setCurrentStep(3);
    };

    const handleFormSubmit = (info) => {
        setReservationInfo(info);
        setCurrentStep(4);
    };

    const handleReservationConfirm = async () => {
        const requestData = {
            slot_id: selectedSlot.id,
            customer_name: reservationInfo.customer_name,
            phone_number: reservationInfo.phone_number,
            email: reservationInfo.email,
            group_size: reservationInfo.group_size,
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/reservations/create`, requestData);
            alert('予約が確定しました');
            setCurrentStep(1);
            setSelectedDate(null);
            setSelectedSlot(null);
            setReservationInfo({});
        } catch (error) {
            console.error("予約の作成に失敗しました:", error);
            alert("予約の作成に失敗しました");
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="reservation-page">
            <h1>予約ページ</h1>
            {currentStep === 1 && <Calendar onDateSelect={handleDateSelect} />}
            {currentStep === 2 && <SlotSelection selectedDate={selectedDate} onSlotSelect={handleSlotSelect} />}
            {currentStep === 3 && (
                <ReservationForm 
                    onSubmit={handleFormSubmit} 
                    max_people={selectedSlot.max_people}
                    slotId={selectedSlot.id}
                />
            )}
            {currentStep === 4 && (
                <ReservationConfirmation
                    date={selectedDate}
                    slot={selectedSlot}
                    info={reservationInfo}
                    onConfirm={handleReservationConfirm}
                />
            )}
            {currentStep > 1 && (
                <button onClick={handleBack} className="back-button">
                    戻る
                </button>
            )}
        </div>
    );
};

export default ReservationPage;
