import React, { useEffect, useState } from 'react';
import { reservationPeriod } from '../utils/utils';

const ReservationSettings = ({
    startMethod,
    setStartMethod,
    startValue,
    setStartValue,
    startUnit,
    setStartUnit,
    releaseIntervalUnit,
    setReleaseIntervalUnit,
    weekReleaseTiming,
    setWeekReleaseTiming,
    monthReleaseTiming,
    setMonthReleaseTiming,
    isSameDay,
    setIsSameDay,
    endHours,
    setEndHours,
    endMinutes,
    setEndMinutes,
    endValue,
    setEndValue,
    endUnit,
    setEndUnit,
}) => {
    const [availablePeriod, setAvailablePeriod] = useState({
        available_since: null,
        available_since_time: null,
        available_until: null,
        next_release_day: null,
    });
    const [errorMessage, setErrorMessage] = useState('');

    // `availablePeriod` の計算
    useEffect(() => {
        const reservationSettings = {
            start: {
                method: startMethod,
                ...(startMethod === 'interval'
                    ? { value: startValue, unit: startUnit }
                    : {
                        releaseInterval: {
                            unit: releaseIntervalUnit,
                            ...(releaseIntervalUnit === 'week' && { weekReleaseTiming }),
                            ...(releaseIntervalUnit === 'month' && { monthReleaseTiming }),
                        },
                    }),
            },
            end: isSameDay
                ? { isSameDay, hoursBefore: endHours, minutesBefore: endMinutes }
                : { isSameDay, value: endValue, unit: endUnit },
        };

        try {
            const result = reservationPeriod(reservationSettings);

            // 受付期間の妥当性チェック
            if (result.available_since.isAfter(result.available_until)) {
                setErrorMessage('予約できる期間がありません');
                setAvailablePeriod({ available_since: null, available_until: null, next_release_day: null });
            } else {
                setErrorMessage('');
                setAvailablePeriod(result);
            }
        } catch (error) {
            setErrorMessage('受付期間の計算に失敗しました');
            console.error('Error calculating available period:', error);
        }
    }, [
        startMethod,
        startValue,
        startUnit,
        releaseIntervalUnit,
        weekReleaseTiming,
        monthReleaseTiming,
        isSameDay,
        endHours,
        endMinutes,
        endValue,
        endUnit,
    ]);

    return (
        <section className="reservation-settings-section">
            <p>予約設定</p>

            {/* エラーメッセージの表示 */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            {/* 現在の受付期間の表示 */}
            {availablePeriod.available_since && availablePeriod.available_until && (
                <div className="current-period">
                    <p>現在の受付期間:</p>
                    <p>
                        {availablePeriod.available_since.format('YYYY-MM-DD')} 〜{' '}
                        {availablePeriod.available_until.format('YYYY-MM-DD')}
                    </p>
                </div>
            )}

            {/* 次の開放日表示（必要な場合のみ） */}
            {startMethod === 'batch' && availablePeriod.next_release_day && (
                <div className="next-release-day">
                    <p>次の受付開始日:</p>
                    <p>{availablePeriod.next_release_day.format('YYYY-MM-DD')}</p>
                </div>
            )}

            {/* フォーム */}
            <div className="form-row">
                <label>受付開始方法:</label>
                <select value={startMethod} onChange={(e) => setStartMethod(e.target.value)}>
                    <option value="interval">一定期間前</option>
                    <option value="batch">一斉開始</option>
                </select>
            </div>

            {startMethod === 'interval' && (
                <div className="form-row">
                    <label>受付開始:</label>
                    <input
                        type="number"
                        value={startValue}
                        min='1'
                        onChange={(e) => setStartValue(Number(e.target.value))}
                    />
                    <select value={startUnit} onChange={(e) => setStartUnit(e.target.value)}>
                        <option value="day">日</option>
                        <option value="week">週</option>
                        <option value="month">月</option>
                        <option value="year">年</option>
                    </select>
                </div>
            )}

            {startMethod === 'batch' && (
                <>
                    <div className="form-row">
                        <label>開放間隔:</label>
                        <select
                            value={releaseIntervalUnit}
                            onChange={(e) => setReleaseIntervalUnit(e.target.value)}
                        >
                            <option value="week">一週間ごと</option>
                            <option value="month">一ヶ月ごと</option>
                        </select>
                    </div>

                    {releaseIntervalUnit === 'week' && (
                        <>
                            <div className="form-row">
                                <label>何週間前から受付を開始しますか:</label>
                                <input
                                    type="number"
                                    value={weekReleaseTiming.weeksBefore}
                                    min='1'
                                    onChange={(e) =>
                                        setWeekReleaseTiming({
                                            ...weekReleaseTiming,
                                            weeksBefore: Number(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div className="form-row">
                                <label>何曜日から受付を開始しますか:</label>
                                <select
                                    value={weekReleaseTiming.day}
                                    onChange={(e) =>
                                        setWeekReleaseTiming({
                                            ...weekReleaseTiming,
                                            day: e.target.value,
                                        })
                                    }
                                >
                                    <option value="sunday">日曜日</option>
                                    <option value="monday">月曜日</option>
                                    <option value="tuesday">火曜日</option>
                                    <option value="wednesday">水曜日</option>
                                    <option value="thursday">木曜日</option>
                                    <option value="friday">金曜日</option>
                                    <option value="saturday">土曜日</option>
                                </select>
                            </div>
                            <div className="form-row">
                                <label>一週間の始まりの曜日:</label>
                                <select
                                    value={weekReleaseTiming.startingDay}
                                    onChange={(e) =>
                                        setWeekReleaseTiming({
                                            ...weekReleaseTiming,
                                            startingDay: e.target.value,
                                        })
                                    }
                                >
                                    <option value="sunday">日曜日</option>
                                    <option value="monday">月曜日</option>
                                    <option value="tuesday">火曜日</option>
                                    <option value="wednesday">水曜日</option>
                                    <option value="thursday">木曜日</option>
                                    <option value="friday">金曜日</option>
                                    <option value="saturday">土曜日</option>
                                </select>
                            </div>
                        </>
                    )}

                    {releaseIntervalUnit === 'month' && (
                        <>
                            <div className="form-row">
                                <label>何ヶ月前から受付を開始しますか:</label>
                                <input
                                    type="number"
                                    value={monthReleaseTiming.monthsBefore}
                                    min='1'
                                    onChange={(e) =>
                                        setMonthReleaseTiming({
                                            ...monthReleaseTiming,
                                            monthsBefore: Number(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div className="form-row">
                                <label>受付を開始する日:</label>
                                <select
                                    value={monthReleaseTiming.date}
                                    onChange={(e) =>
                                        setMonthReleaseTiming({
                                            ...monthReleaseTiming,
                                            date: e.target.value === "end" ? "end" : Number(e.target.value),
                                        })
                                    }
                                >
                                    {Array.from({ length: 28 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1}日
                                        </option>
                                    ))}
                                    <option value="end">月末</option>
                                </select>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* ENDセクション */}
            <div className="form-row">
                <label>当日受付:</label>
                <input
                    type="checkbox"
                    checked={isSameDay}
                    onChange={(e) => setIsSameDay(e.target.checked)}
                />
            </div>

            {isSameDay ? (
                <div className="form-row">
                    <label>受付終了 (当日):</label>
                    <input
                        type="number"
                        value={endHours}
                        onChange={(e) => setEndHours(Number(e.target.value))}
                        min="0"
                    />
                    時間
                    <input
                        type="number"
                        value={endMinutes}
                        onChange={(e) => setEndMinutes(Number(e.target.value))}
                        min="0"
                        max="59"
                    />
                    分前まで
                </div>
            ) : (
                <div className="form-row">
                    <label>受付終了 (事前):</label>
                    <input
                        type="number"
                        value={endValue}
                        min='1'
                        onChange={(e) => setEndValue(Number(e.target.value))}
                    />
                    <select value={endUnit} onChange={(e) => setEndUnit(e.target.value)}>
                        <option value="day">日</option>
                        <option value="week">週</option>
                        <option value="month">月</option>
                    </select>
                    前まで
                </div>
            )}
        </section>
    );
};

export default ReservationSettings;
