import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { reservationPeriod } from '../utils/dateUtils';
import Calendar from '../components/Calendar';
import SlotSelection from '../components/SlotSelection';
import ReservationForm from '../components/ReservationForm';
import ReservationConfirmation from '../components/ReservationConfirmation';
import ProgressIndicator from '../components/ProgressIndicator';
import '../styles/reservationPage.scss';

const ReservationPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reservationInfo, setReservationInfo] = useState({});
    const [reservationId, setReservationId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [settings, setSettings] = useState(null);
    const [reservationPeriodInfo, setReservationPeriodInfo] = useState({
        available_since: null,
        available_until: null,
    });

    const steps = ["日付選択", "時間選択", "情報入力", "確認", "完了"];

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/settings/public`);
            if (response.status === 200) {
                const fetchedSettings = response.data;
                setSettings(fetchedSettings);

                const { available_since, available_until } = reservationPeriod(fetchedSettings.reservationSettings);
                setReservationPeriodInfo({
                    available_since: available_since.format('YYYY-MM-DD'),
                    available_until: available_until.format('YYYY-MM-DD'),
                });
            } else {
                console.error("設定情報の取得に失敗しました:", response.status);
            }
        } catch (error) {
            console.error("設定情報の取得エラー:", error);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setCurrentStep(2);
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setCurrentStep(3);
    };

    const handleFormSubmit = (formData) => {
        setReservationInfo(formData);
        setCurrentStep(4);
    };

    const handleConfirmReservation = (reservationId) => {
        setReservationId(reservationId);
        setCurrentStep(5);
    };

    const handleBack = () => {
        if (currentStep > 1 && currentStep !== 'error') {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="reservation-page">
            <ProgressIndicator currentStep={currentStep} steps={steps} />
            {currentStep > 1 && currentStep !== '5' && currentStep !== 'error' && (
                <button onClick={handleBack} className="back-button">
                    ＜ 戻る
                </button>
            )}

            {currentStep === 1 && (
                <Calendar
                    onDateSelect={handleDateSelect}
                    availableSince={reservationPeriodInfo.available_since}
                    availableUntil={reservationPeriodInfo.available_until}
                />
            )}

            {currentStep === 2 && selectedDate && (
                <SlotSelection
                    selectedDate={selectedDate}
                    availableSince={reservationPeriodInfo.available_since}
                    availableUntil={reservationPeriodInfo.available_until}
                    onSlotSelect={handleSlotSelect}
                />
            )}

            {currentStep === 3 && selectedSlot && (
                <ReservationForm
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot}
                    onFormSubmit={handleFormSubmit}
                />
            )}

            {currentStep === 4 && reservationInfo && (
                <ReservationConfirmation
                    reservationInfo={reservationInfo}
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot}
                    onConfirm={handleConfirmReservation}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                    setErrorMessage={setErrorMessage}
                />
            )}

            {currentStep === 5 && reservationId && (
                <div className="reservation-complete">
                    <h2>予約が完了しました！</h2>
                    <p>予約ID: {reservationId}</p>
                    <button onClick={() => setCurrentStep(1)}>新しい予約をする</button>
                </div>
            )}
        </div>
    );
};

export default ReservationPage;
