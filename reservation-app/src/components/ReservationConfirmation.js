import React from 'react';
import { removeSecond } from '../utils/dateUtils';
import '../styles/reservationConfirmation.scss';

const ReservationConfirmation = ({ date, slot, info, onConfirm }) => {
    return (
        <div className="reservation-confirmation">
            <h2>予約内容確認</h2>
            <table>
                <tbody>
                    <tr>
                        <th>日時：</th>
                        <td>{date} {removeSecond(slot.start_time)} 〜 {removeSecond(slot.end_time)}</td>
                    </tr>
                    <tr>
                        <th>名前：</th>
                        <td>{info.customer_name}</td>
                    </tr>
                    <tr>
                        <th>電話番号：</th>
                        <td>{info.phone_number}</td>
                    </tr>
                    <tr>
                        <th>メールアドレス：</th>
                        <td>{info.email}</td>
                    </tr>
                    <tr>
                        <th>人数：</th>
                        <td>{info.group_size}</td>
                    </tr>
                </tbody>
            </table>
            <button onClick={onConfirm} className="confirm-button">予約を確定</button>
        </div>
    );
};

export default ReservationConfirmation;
