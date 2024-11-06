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