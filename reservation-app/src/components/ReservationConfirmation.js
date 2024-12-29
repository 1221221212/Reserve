import React from 'react';
import { removeSecond } from '../utils/utils';

const ReservationConfirmation = ({ reservationInfo, selectedDate, selectedSlot, onConfirm, isSubmitting }) => {
    return (
        <div className="reservation-confirmation">
            <p>予約内容確認</p>
            <table>
                <tbody>
                    <tr>
                        <th>日時：</th>
                        <td>{selectedDate} {removeSecond(selectedSlot.start_time)} 〜 {removeSecond(selectedSlot.end_time)}</td>
                    </tr>
                    <tr>
                        <th>名前：</th>
                        <td>{reservationInfo.customer_name}</td>
                    </tr>
                    <tr>
                        <th>電話番号：</th>
                        <td>{reservationInfo.phone_number}</td>
                    </tr>
                    <tr>
                        <th>メールアドレス：</th>
                        <td>{reservationInfo.email}</td>
                    </tr>
                    <tr>
                        <th>人数：</th>
                        <td>{reservationInfo.group_size}</td>
                    </tr>
                    <tr>
                        <th>コメント：</th>
                        <td>{reservationInfo.comment || 'なし'}</td>
                    </tr>
                </tbody>
            </table>
            <button onClick={onConfirm} className="confirm-button" disabled={isSubmitting}>
                予約を確定
            </button>
        </div>
    );
};

export default ReservationConfirmation;
