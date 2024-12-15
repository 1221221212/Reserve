import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CloseForm = ({ onClosedDaySaved }) => {
    const [type, setType] = useState('regular_weekly');
    const [monthlyOption, setMonthlyOption] = useState('day');
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [weekOfMonth, setWeekOfMonth] = useState('');
    const [dayOfMonth, setDayOfMonth] = useState('1');
    const [monthOfYear, setMonthOfYear] = useState('');
    const [temporaryDate, setTemporaryDate] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    // フォームのバリデーション関数
    const validateForm = () => {
        if (type === 'regular_weekly') {
            return !!dayOfWeek;
        }
        if (type === 'regular_monthly') {
            if (monthlyOption === 'day') {
                return !!dayOfMonth;
            }
            if (monthlyOption === 'week') {
                return !!weekOfMonth && !!dayOfWeek;
            }
        }
        if (type === 'regular_yearly') {
            return !!monthOfYear && !!dayOfMonth;
        }
        if (type === 'temporary') {
            return !!temporaryDate; // Reasonは必須ではない
        }
        return false;
    };

    // フォーム変更時にバリデーションを実行
    useEffect(() => {
        setIsFormValid(validateForm());
    }, [type, monthlyOption, dayOfWeek, weekOfMonth, dayOfMonth, monthOfYear, temporaryDate]);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!isFormValid) {
            alert('フォームを正しく入力してください');
            return;
        }
    
        const payload = { type };
    
        if (type === 'regular_monthly') {
            if (monthlyOption === 'day') {
                payload.day_of_month = dayOfMonth;
            } else if (monthlyOption === 'week') {
                payload.week_of_month = weekOfMonth;
                payload.day_of_week = dayOfWeek;
            }
        } else if (type === 'regular_weekly') {
            payload.day_of_week = dayOfWeek;
        } else if (type === 'regular_yearly') {
            payload.month_of_year = monthOfYear;
            payload.day_of_month = dayOfMonth;
        } else if (type === 'temporary') {
            payload.date = temporaryDate;
            payload.reason = reason;
        }
    
        onClosedDaySaved(payload); // 親コンポーネントにデータを渡す
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    休業日タイプ:
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="regular_weekly">毎週の定休日</option>
                        <option value="regular_monthly">毎月の定休日</option>
                        <option value="regular_yearly">毎年の定休日</option>
                        <option value="temporary">臨時休業日</option>
                    </select>
                </label>
            </div>

            {type === 'regular_weekly' && (
                <div>
                    <label>
                        曜日:
                        <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
                            <option value="">選択してください</option>
                            <option value="Monday">月曜日</option>
                            <option value="Tuesday">火曜日</option>
                            <option value="Wednesday">水曜日</option>
                            <option value="Thursday">木曜日</option>
                            <option value="Friday">金曜日</option>
                            <option value="Saturday">土曜日</option>
                            <option value="Sunday">日曜日</option>
                        </select>
                    </label>
                </div>
            )}

            {type === 'regular_monthly' && (
                <div>
                    <label>
                        毎月の設定:
                        <select value={monthlyOption} onChange={(e) => setMonthlyOption(e.target.value)}>
                            <option value="day">毎月の特定日</option>
                            <option value="week">毎月第〇何曜日</option>
                        </select>
                    </label>
                    {monthlyOption === 'day' && (
                        <label>
                            毎月何日:
                            <select
                                value={dayOfMonth}
                                onChange={(e) => setDayOfMonth(e.target.value)}
                            >
                                {[...Array(31).keys()].map((day) => (
                                    <option key={day + 1} value={day + 1}>
                                        {day + 1}日
                                    </option>
                                ))}
                                <option value="99">月末</option>
                            </select>
                        </label>
                    )}

                    {monthlyOption === 'week' && (
                        <>
                            <label>
                                毎月第:
                                <input
                                    type="number"
                                    value={weekOfMonth}
                                    onChange={(e) => setWeekOfMonth(e.target.value)}
                                    min="1"
                                    max="5"
                                />
                            </label>
                            <label>
                                何曜日:
                                <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
                                    <option value="">選択してください</option>
                                    <option value="Monday">月曜日</option>
                                    <option value="Tuesday">火曜日</option>
                                    <option value="Wednesday">水曜日</option>
                                    <option value="Thursday">木曜日</option>
                                    <option value="Friday">金曜日</option>
                                    <option value="Saturday">土曜日</option>
                                    <option value="Sunday">日曜日</option>
                                </select>
                            </label>
                        </>
                    )}
                </div>
            )}

            {type === 'regular_yearly' && (
                <div>
                    <label>
                        月:
                        <input
                            type="number"
                            value={monthOfYear}
                            onChange={(e) => setMonthOfYear(e.target.value)}
                            min="1"
                            max="12"
                        />
                    </label>
                    <label>
                        日:
                        <input
                            type="number"
                            value={dayOfMonth}
                            onChange={(e) => setDayOfMonth(e.target.value)}
                            min="1"
                            max="31"
                        />
                    </label>
                </div>
            )}

            {type === 'temporary' && (
                <div>
                    <label>
                        日付:
                        <input
                            type="date"
                            value={temporaryDate}
                            onChange={(e) => setTemporaryDate(e.target.value)}
                        />
                    </label>
                    <label>
                        理由:
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </label>
                </div>
            )}

            <button type="submit" disabled={!isFormValid || isSubmitting}>
                {isSubmitting ? '作成中...' : '休業日を作成'}
            </button>
        </form>
    );
};

export default CloseForm;
