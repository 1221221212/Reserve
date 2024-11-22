import React, { useState, useEffect } from 'react';
import { reservationPeriod } from '../utils/dateUtils';
import moment from 'moment';

const ReservationSettings = () => {
    // 初期値の設定
    const [startMethod, setStartMethod] = useState('interval');
    const [startValue, setStartValue] = useState(1);
    const [startUnit, setStartUnit] = useState('month');
    const [releaseIntervalUnit, setReleaseIntervalUnit] = useState('week');

    const [weekReleaseTiming, setWeekReleaseTiming] = useState({
        weeksBefore: 1,
        day: 'sunday',
        startingDay: 'sunday',
    });

    const [monthReleaseTiming, setMonthReleaseTiming] = useState({
        monthsBefore: 1,
        date: 1,
    });

    const [isSameDay, setIsSameDay] = useState(false);
    const [endHours, setEndHours] = useState(0);
    const [endMinutes, setEndMinutes] = useState(0);
    const [endValue, setEndValue] = useState(1);
    const [endUnit, setEndUnit] = useState('day');

    // 新たに追加する状態変数
    const [availablePeriod, setAvailablePeriod] = useState({
        available_since: null,
        available_until: null,
        next_release_day: null,
    });

    const [errorMessage, setErrorMessage] = useState('');

    // useEffectで予約設定を更新
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

        const result = reservationPeriod(reservationSettings);

        // 受付期間の妥当性チェック
        if (result.available_since.isAfter(result.available_until)) {
            setErrorMessage('予約できる期間がありません');
        } else {
            setErrorMessage('');
        }

        setAvailablePeriod(result);
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
            <h2>予約設定</h2>

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

            {/* NextReleaseDay の表示（開始方法が 'batch' の場合のみ） */}
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
                    <input type="number" value={startValue} onChange={(e) => setStartValue(e.target.value)} />
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
                        <select value={releaseIntervalUnit} onChange={(e) => setReleaseIntervalUnit(e.target.value)}>
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
                                    onChange={(e) =>
                                        setWeekReleaseTiming({
                                            ...weekReleaseTiming,
                                            weeksBefore: parseInt(e.target.value, 10),
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
                </>
            )}

            {/* ENDセクション */}
            <div className="form-row">
                <label>当日受付:</label>
                <input type="checkbox" checked={isSameDay} onChange={(e) => setIsSameDay(e.target.checked)} />
            </div>

            {isSameDay ? (
                <div className="form-row">
                    <label>受付終了 (当日):</label>
                    <input
                        type="number"
                        value={endHours}
                        onChange={(e) => setEndHours(parseInt(e.target.value, 10))}
                        min="0"
                    />
                    時間
                    <input
                        type="number"
                        value={endMinutes}
                        onChange={(e) => setEndMinutes(parseInt(e.target.value, 10))}
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
                        onChange={(e) => setEndValue(parseInt(e.target.value, 10))}
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
