// src/pages/ReservationPage.js
import React, { useState } from 'react';
import axios from 'axios';
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

    const steps = ["日付選択", "スロット選択", "情報入力", "確認"];

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

            // 成功時の処理
            if (response.data.success === true) {
                alert('予約が確定しました');
                setCurrentStep(1);
                setSelectedDate(null);
                setSelectedSlot(null);
                setReservationInfo({});
            } else {
                alert(response.data.message || '予約に失敗しました。');
            }
        } catch (error) {
            // エラーメッセージを分岐して取得
            if (error.response && error.response.data && error.response.data.message) {
                // サーバーからのエラーメッセージがある場合
                alert(error.response.data.message);
            } else {
                // サーバーに接続できない、またはレスポンスが返ってこない場合
                alert("サーバーエラーにより予約の作成に失敗しました。");
            }
            console.error("予約の作成に失敗しました:", error);
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
            <ProgressIndicator currentStep={currentStep} steps={steps} />
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
