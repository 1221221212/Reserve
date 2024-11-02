// src/components/ReservationConfirmation.js

import React from 'react';
import { removeSecond } from '../utils/dateUtils';
import '../styles/reservationConfirmation.scss';

const ReservationConfirmation = ({ date, slot, info, onConfirm }) => {
    return (
        <div className="reservation-confirmation">
            <h2>予約内容確認</h2>
            <p className="confirmation-item">日時: {date}  {removeSecond(slot.start_time)} 〜 {removeSecond(slot.end_time)}</p>
            <p className="confirmation-item">名前: {info.customer_name}</p>
            <p className="confirmation-item">電話番号: {info.phone_number}</p>
            <p className="confirmation-item">メールアドレス: {info.email}</p>
            <p className="confirmation-item">人数: {info.group_size}</p>
            <button onClick={onConfirm} className="confirm-button">予約を確定</button>
        </div>
    );
};

export default ReservationConfirmation;
