import React, { useState } from 'react';
import axios from 'axios';
import Calendar from '../components/Calendar';
import SlotSelection from '../components/SlotSelection';
import ReservationForm from '../components/ReservationForm';
import ReservationConfirmation from '../components/ReservationConfirmation';
import ProgressIndicator from '../components/ProgressIndicator';
import '../styles/reservationPage.scss';
import "../styles/reservationCommon.scss"

const ReservationPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reservationInfo, setReservationInfo] = useState({});
    const [reservationId, setReservationId] = useState(null); // 予約IDを保存する状態変数
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = ["日付選択", "時間選択", "情報入力", "確認", "完了"];

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
        if (isSubmitting) return;  // 連打防止
        setIsSubmitting(true);  // ボタンを無効化

        const requestData = {
            slot_id: selectedSlot.id,
            customer_name: reservationInfo.customer_name,
            phone_number: reservationInfo.phone_number,
            email: reservationInfo.email,
            group_size: reservationInfo.group_size,
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/reservations/create`, requestData);

            if (response.data.success) {
                setReservationId(response.data.reservation.reservation_number); // 予約IDを保存
                alert('予約が確定しました');
                setCurrentStep('5'); // 完了画面に遷移
            } else {
                alert(response.data.message || '予約に失敗しました。');
            }
        } catch (error) {
            alert("サーバーエラーにより予約の作成に失敗しました。");
            console.error("予約の作成に失敗しました:", error);
        } finally {
            setIsSubmitting(false);  // 処理が完了したらボタンを再有効化
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="reservation-page">
            <ProgressIndicator currentStep={currentStep} steps={steps} />
            {currentStep > 1 && currentStep !== '5' && (
                <button onClick={handleBack} className="back-button">
                    ＜ 戻る
                </button>
            )}
            {currentStep === 1 && <Calendar onDateSelect={handleDateSelect} />}
            {currentStep === 2 && <SlotSelection selectedDate={selectedDate} onSlotSelect={handleSlotSelect} />}
            {currentStep === 3 && (
                <ReservationForm 
                    onSubmit={handleFormSubmit}
                    max_groups={selectedSlot.max_groups}
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
                    isSubmitting={isSubmitting}
                />
            )}
            {currentStep === '5' && (
                <div className="reservation-complete">
                    <h2>予約が完了しました</h2>
                    <p>ご予約ありがとうございます。ご登録いただいた情報に確認のメールをお送りしました。</p>
                    {reservationId && (
                        <p>予約ID: <strong>{reservationId}</strong></p>
                    )}
                    <button onClick={() => setCurrentStep(1)}>ホームへ戻る</button>
                </div>
            )}
        </div>
    );
};

export default ReservationPage;
