import React from 'react';

const ConfirmCloseConflict = ({ conflicts, onConfirm, onCancel }) => {
    return (
        <div className="confirm-close-conflict">
            <h2>競合する日付があります</h2>
            <p>以下の日付は既存の予約枠が存在します。これらをクローズしてもよろしいですか？</p>
            <ul>
                {Object.entries(conflicts).map(([date, slotIds]) => (
                    <li key={date}>
                        <strong>{new Date(date).toLocaleDateString()}</strong>: Slots - {slotIds.join(', ')}
                    </li>
                ))}
            </ul>
            <div className="actions">
                <button className="confirm-button" onClick={onConfirm}>
                    はい、続行します
                </button>
                <button className="cancel-button" onClick={onCancel}>
                    キャンセル
                </button>
            </div>
        </div>
    );
};

export default ConfirmCloseConflict;
