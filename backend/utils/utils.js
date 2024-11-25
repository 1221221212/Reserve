const moment = require('moment-timezone');

// UTCのDate文字列をJSTのDateオブジェクトに変換する
exports.utcToJstDate = (date) => {
    return moment.utc(date).tz('Asia/Tokyo').format('YYYY-MM-DD');
};

// 秒がいらないとき
exports.removeSecond = (timeString) => {
    return moment(timeString, 'HH:mm:ss').format('HH:mm'); // 時間文字列から秒を削除
};

/**
 * 予約可能期間を計算
 * @param {object} reservation_settings - 予約設定
 * @returns {object} - { available_since, available_since_time, available_until, next_release_day }
 */
exports.reservationPeriod = (reservation_settings) => {
    const today = moment(); // 現在の日付

    // 初期化
    let available_since = today.clone();
    let available_since_time = today.clone();
    let available_until = today.clone();
    let next_release_day = today.clone();

    try {
        // "いつから"の計算
        if (reservation_settings.end.isSameDay) {
            available_since = today.clone(); // 今日の日付

            // 当日の受付開始時刻の計算
            const now = moment(); // 現在の時刻
            const cutoffTime = now.clone()
                .add(reservation_settings.end.hoursBefore, 'hours')
                .add(reservation_settings.end.minutesBefore, 'minutes');

            // available_since_timeを追加
            available_since_time = cutoffTime;

        } else {
            const { value, unit } = reservation_settings.end;
            if (value) {
                available_since = today.clone().add(parseInt(value, 10), unit);
            }
        }

        // "いつまで"の計算
        if (reservation_settings.start.method === 'interval') {
            const { value, unit } = reservation_settings.start;
            if (value) {
                available_until = today.clone().add(parseInt(value, 10), unit);
            }
        } else if (reservation_settings.start.method === 'batch') {
            const releaseInterval = reservation_settings.start.releaseInterval;

            if (releaseInterval?.unit === 'month') {
                const todayDate = today.date();
                const { date, monthsBefore } = releaseInterval.monthReleaseTiming; // monthsBeforeを取得
                const parsedDate = parseInt(date, 10);

                if (!isNaN(parsedDate)) {
                    if (todayDate >= parsedDate) {
                        next_release_day = today.clone().add(1, 'month').date(parsedDate);
                    } else {
                        next_release_day = today.clone().date(parsedDate);
                    }
                } else if (date === 'end_of_month') {
                    const lastDayOfMonth = today.clone().endOf('month').date();
                    if (todayDate === lastDayOfMonth) {
                        next_release_day = today.clone().add(1, 'month').endOf('month');
                    } else {
                        next_release_day = today.clone().endOf('month');
                    }
                } else {
                    console.error("Invalid date in MonthReleaseTiming:", date);
                    next_release_day = today.clone();
                }

                if (!isNaN(monthsBefore)) {
                    available_until = next_release_day.clone().add(monthsBefore - 1, 'month').endOf('month');
                } else {
                    console.error("Invalid monthsBefore in MonthReleaseTiming:", monthsBefore);
                    available_until = today.clone(); // デフォルト値
                }
            }
            else if (releaseInterval?.unit === 'week') {
                const { day, weeksBefore, startingDay } = releaseInterval.weekReleaseTiming || {};
                if (day) {
                    const targetDay = day.toLowerCase();
                    next_release_day = today.clone().day(targetDay);
                    if (next_release_day.isSame(today, 'day') || next_release_day.isBefore(today, 'day')) {
                        next_release_day.add(1, 'week');
                    }
                } else {
                    console.error("Invalid day in WeekReleaseTiming:", day);
                    next_release_day = today.clone();
                }

                if (!isNaN(weeksBefore)) {
                    const baseDate = next_release_day.clone().add(weeksBefore - 1, 'week');
                    const startingDayIndex = moment().day(startingDay.toLowerCase()).day();
                    const daysDifference = (startingDayIndex - baseDate.day() + 7) % 7 || 7;

                    available_until = baseDate.clone().add(daysDifference, 'day').subtract(1, 'day');
                } else {
                    console.error("Invalid weeksBefore in WeekReleaseTiming:", weeksBefore);
                    available_until = today.clone();
                }
            } else {
                console.error("Invalid unit in releaseInterval:", releaseInterval?.unit);
                next_release_day = today.clone();
            }
        }

        return { available_since, available_since_time, available_until, next_release_day };
    } catch (error) {
        console.error("予約期間計算中にエラーが発生しました:", error.message);
        throw new Error("予約期間の計算に失敗しました");
    }
};
