import moment from 'moment';

export const extractDates = (startDate, endDate, cycle, selectedDays) => {
    const dates = [];
    let currentDate = moment(startDate);

    while (currentDate.isSameOrBefore(endDate, 'day')) {
        const dayOfWeek = currentDate.day();

        if (cycle === 'weekly' && selectedDays.includes(dayOfWeek)) {
            dates.push(currentDate.clone().toDate());
        } else if (cycle === 'monthly' && selectedDays.includes(currentDate.date())) {
            dates.push(currentDate.clone().toDate());
        } else if (cycle === 'daily') {
            dates.push(currentDate.clone().toDate());
        }

        currentDate.add(1, 'days'); // 一日ずつ進める
    }

    return dates;
};

// 祝日リストに基づいたフィルタリング関数
export const filterDates = (dates, holidays, option) => {
    const holidayDates = holidays.map(h => moment(h.date).format('YYYY-MM-DD'));

    return dates.filter(date => {
        const dateStr = moment(date).format('YYYY-MM-DD');

        if (option === 'Include') {
            return true;
        } else if (option === 'Exclude') {
            return !holidayDates.includes(dateStr);
        } else if (option === 'Only') {
            return holidayDates.includes(dateStr);
        }

        return true;
    });
};

//秒がいらないとき
export const removeSecond = (timeString) => {
    return moment(timeString, 'HH:mm:ss').format('HH:mm'); // 時間文字列から秒を削除
};

export const reservationPeriod = (reservation_settings) => {
    // 現在の日付を取得
    const today = moment();

    // 初期化
    let available_since = today.clone();
    let available_until = today.clone();
    let next_release_day = today.clone();

    // "いつから"の計算
    if (reservation_settings.end.isSameDay) {
        available_since = today.clone(); // 今日から受付
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

    return { available_since, available_until, next_release_day };
};
