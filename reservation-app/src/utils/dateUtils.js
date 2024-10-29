// src/utils/dateUtils.js

export const extractDates = (startDate, endDate, cycle, selectedDays) => {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();

        if (cycle === 'weekly' && selectedDays.includes(dayOfWeek)) {
            dates.push(new Date(currentDate));
        } else if (cycle === 'monthly' && selectedDays.includes(currentDate.getDate())) {
            dates.push(new Date(currentDate));
        } else if (cycle === 'daily') {
            dates.push(new Date(currentDate));
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

// 祝日リストに基づいたフィルタリング関数
export const filterDates = (dates, holidays, option) => {
    const holidayDates = holidays.map(h => h.date);

    if (option === 'Include') {
        return dates;
    } else if (option === 'Exclude') {
        return dates.filter(date => !holidayDates.includes(date.toISOString().split('T')[0]));
    } else if (option === 'Only') {
        return dates.filter(date => holidayDates.includes(date.toISOString().split('T')[0]));
    }
    return dates;
};
