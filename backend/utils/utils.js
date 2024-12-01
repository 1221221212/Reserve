const moment = require('moment-timezone');
const { format, addDays, addMonths } = require('date-fns'); // addMonths を追加


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

// 定休日を基に期間内の日付を生成
exports.generateRegularClosedDays = (regularClosedDays, startDate, endDate) => {
    const result = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    regularClosedDays.forEach((day) => {
        if (day.type === 'regular_weekly' && day.day_of_week) {
            // 毎週の休業日を生成
            const dayOfWeek = day.day_of_week;
            let current = new Date(start);
            while (current <= end) {
                if (current.toLocaleDateString('en-US', { weekday: 'long' }) === dayOfWeek) {
                    result.push({ date: format(current, 'yyyy-MM-dd'), type: 'regular_weekly' });
                }
                current = addDays(current, 1);
            }
        } else if (day.type === 'regular_monthly') {
            // 毎月の日付生成
            if (day.day_of_month) {
                let current = new Date(start);
                while (current <= end) {
                    if (current.getDate() === day.day_of_month) {
                        result.push({ date: format(current, 'yyyy-MM-dd'), type: 'regular_monthly' });
                    }
                    current = addDays(current, 1);
                }
            }
            // 毎月第X曜日を生成
            if (day.type === 'regular_monthly' && day.week_of_month && day.day_of_week) {
                let current = new Date(start);
                while (current <= end) {
                    const month = current.getMonth();
                    const year = current.getFullYear();

                    // 第X曜日の計算
                    const firstDay = new Date(year, month, 1);
                    const dayOffset = (7 + getDayIndex(day.day_of_week) - firstDay.getDay()) % 7;
                    const targetDate = new Date(year, month, 1 + dayOffset + (day.week_of_month - 1) * 7);

                    if (targetDate >= start && targetDate <= end) {
                        result.push({
                            date: format(targetDate, 'yyyy-MM-dd'),
                            type: 'regular_monthly',
                        });
                    }

                    current = addMonths(current, 1);
                }
            }

        } else if (day.type === 'regular_yearly') {
            // 毎年の日付生成
            if (day.day_of_month && day.month_of_year) {
                let current = new Date(start);
                while (current <= end) {
                    if (current.getMonth() + 1 === day.month_of_year && current.getDate() === day.day_of_month) {
                        result.push({ date: format(current, 'yyyy-MM-dd'), type: 'regular_yearly' });
                    }
                    current = addDays(current, 1);
                }
            }
        }
    });

    return result;
};

/**
 * 曜日をインデックスに変換する関数
 * @param {string} dayOfWeek - 曜日（例: "Monday"）
 * @returns {number} - インデックス（0-6）
 */
const getDayIndex = (dayOfWeek) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.indexOf(dayOfWeek);
};

// 重複を削除する関数
exports.removeDuplicates = (closedDays) => {
    const uniqueMap = new Map();

    closedDays.forEach((day) => {
        const key = day.date;
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, day);
        } else {
            // 優先順位を設定（例: 臨時休業日 > 定休日）
            if (day.type === 'temporary') {
                uniqueMap.set(key, day);
            }
        }
    });

    return Array.from(uniqueMap.values());
};
