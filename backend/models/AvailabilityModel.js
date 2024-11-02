const db = require('./db');

// 月単位での予約枠の空き状況を取得
exports.getMonthlyAvailability = async (year, month) => {
    const query = `
        SELECT assigned_slots.date, assigned_slots.pattern_id,
               (CASE
                   WHEN (COUNT(reservations.id) < reservation_patterns.max_groups OR reservation_patterns.max_groups IS NULL)
                   THEN '0'
                   ELSE '1'
               END) AS availability
        FROM assigned_slots
        LEFT JOIN reservation_patterns ON assigned_slots.pattern_id = reservation_patterns.id
        LEFT JOIN reservations ON assigned_slots.id = reservations.slot_id
        WHERE YEAR(assigned_slots.date) = ? AND MONTH(assigned_slots.date) = ?
        GROUP BY assigned_slots.date, assigned_slots.pattern_id;
    `;

    try {
        const [rows] = await db.query(query, [year, month]);
        return rows;
    } catch (error) {
        console.error("月単位の空き状況取得に失敗しました:", error);
        throw error;
    }
};

// 日単位での予約枠の空き状況を取得
exports.getDailyAvailability = async (date) => {
    const query = `
        SELECT assigned_slots.id, assigned_slots.date, assigned_slots.pattern_id, 
               reservation_patterns.start_time, reservation_patterns.end_time,
               (CASE
                   WHEN COUNT(reservations.id) < reservation_patterns.max_groups OR reservation_patterns.max_groups IS NULL
                   THEN '0'
                   ELSE '1'
               END) AS availability
        FROM assigned_slots
        LEFT JOIN reservation_patterns ON assigned_slots.pattern_id = reservation_patterns.id
        LEFT JOIN reservations ON assigned_slots.id = reservations.slot_id
        WHERE assigned_slots.date = ?
        GROUP BY assigned_slots.id, assigned_slots.date, assigned_slots.pattern_id;
    `;

    try {
        const [rows] = await db.query(query, [date]);
        return rows.map(row => ({
            ...row,
            slot_time: `${row.start_time} - ${row.end_time}` // スロットの時間を追加
        }));
    } catch (error) {
        console.error("日単位の空き状況取得に失敗しました:", error);
        throw error;
    }
};
