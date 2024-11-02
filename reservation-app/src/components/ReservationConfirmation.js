// src/components/ReservationConfirmation.js

import React from 'react';

const ReservationConfirmation = ({ date, slot, info, onConfirm }) => {
    return (
        <div>
            <h2>予約内容確認</h2>
            <p>日時: {date.toLocaleDateString()} - {slot.start_time} から {slot.end_time}</p>
            <p>名前: {info.customer_name}</p>
            <p>電話番号: {info.phone_number}</p>
            <p>メールアドレス: {info.email}</p>
            <p>人数: {info.group_size}</p>
            <button onClick={onConfirm}>予約を確定</button>
        </div>
    );
};

export default ReservationConfirmation;
