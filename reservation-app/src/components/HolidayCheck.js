// src/components/HolidayCheck.js
import React from 'react';

const HolidayCheck = ({ holidayOption, setHolidayOption }) => {
    return (
        <div className="holiday-check">
            <label>祝日の扱い:</label>
            <select value={holidayOption} onChange={(e) => setHolidayOption(e.target.value)}>
                <option value="Include">祝日を含める</option>
                <option value="Exclude">祝日を除外する</option>
                <option value="Only">祝日のみ</option>
            </select>
        </div>
    );
};

export default HolidayCheck;
