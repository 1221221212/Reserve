// src/components/DatePreview.js
import React from 'react';

const DatePreview = ({ dates }) => {
    return (
        <div>
            <h2>抽出された日付リスト</h2>
            <ul>
                {dates.map((date, index) => (
                    <li key={index}>{date.toISOString().split('T')[0]}</li>
                ))}
            </ul>
        </div>
    );
};

export default DatePreview;
