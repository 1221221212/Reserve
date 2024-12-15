const db = require("./db");

exports.getMonthlyAvailability = async (year, month, availableSince, availableSinceTime, availableUntil) => {
    const query = `
        SELECT assigned_slots.date, 
               assigned_slots.pattern_id,
               reservation_patterns.start_time,
               reservation_patterns.end_time,
               (CASE
                   WHEN reservation_patterns.max_groups IS NULL AND IFNULL(SUM(reservations.group_size), 0) < reservation_patterns.max_people
                   THEN '0'
                   WHEN reservation_patterns.max_groups IS NOT NULL AND COUNT(reservations.id) < reservation_patterns.max_groups
                   THEN '0'
                   ELSE '1'
               END) AS availability
        FROM assigned_slots
        LEFT JOIN reservation_patterns ON assigned_slots.pattern_id = reservation_patterns.id
        LEFT JOIN reservations ON assigned_slots.id = reservations.slot_id
        WHERE YEAR(assigned_slots.date) = ? 
          AND MONTH(assigned_slots.date) = ? 
          AND assigned_slots.date BETWEEN ? AND ?
          ${availableSinceTime
            ? `AND (assigned_slots.date != ? OR reservation_patterns.start_time >= ?)`
            : ""
        }
        AND assigned_slots.status = 'active'
        AND reservation_pattern.stutus = 'active'
        GROUP BY assigned_slots.date, assigned_slots.pattern_id;
    `;

    const queryParams = [year, month, availableSince, availableUntil];

    // 当日フィルタ用のパラメータを追加
    if (availableSinceTime) {
        queryParams.push(availableSince); // 当日の日付
        queryParams.push(availableSinceTime); // 開始時刻フィルタ
    }

    try {
        const [rows] = await db.query(query, queryParams);
        return rows;
    } catch (error) {
        console.error("月単位の空き状況取得に失敗しました:", error);
        throw error;
    }
};

exports.getDailyAvailability = async (date, availableSince, availableSinceTime, availableUntil) => {
    const query = `
        SELECT 
            assigned_slots.id, 
            assigned_slots.date, 
            assigned_slots.pattern_id, 
            reservation_patterns.start_time, 
            reservation_patterns.end_time, 
            reservation_patterns.max_people,
            reservation_patterns.max_groups,
            COUNT(reservations.id) AS reservation_count,
            IFNULL(SUM(reservations.group_size), 0) AS current_people,
            (CASE
                WHEN reservation_patterns.max_groups IS NULL AND IFNULL(SUM(reservations.group_size), 0) < reservation_patterns.max_people
                THEN '0'
                WHEN reservation_patterns.max_groups IS NOT NULL AND COUNT(reservations.id) < reservation_patterns.max_groups
                THEN '0'
                ELSE '1'
            END) AS availability
        FROM assigned_slots
        LEFT JOIN reservation_patterns ON assigned_slots.pattern_id = reservation_patterns.id
        LEFT JOIN reservations ON assigned_slots.id = reservations.slot_id
        WHERE assigned_slots.date = ? 
        AND assigned_slots.date BETWEEN ? AND ?
        AND assigned_slots.status = 'active'
        AND reservation_pattern.stutus = 'active'
        ${availableSinceTime
            ? `AND reservation_patterns.start_time >= ?`
            : ""
        }
        GROUP BY 
            assigned_slots.id, 
            assigned_slots.date, 
            assigned_slots.pattern_id
        ORDER BY 
            reservation_patterns.start_time ASC,
            reservation_patterns.end_time ASC,
            assigned_slots.id ASC;
    `;

    const queryParams = [date, availableSince, availableUntil];

    // 時間フィルターを追加
    if (availableSinceTime) {
        queryParams.push(availableSinceTime);
    }

    try {
        const [rows] = await db.query(query, queryParams);
        return rows.map((row) => ({
            ...row,
            slot_time: `${row.start_time.slice(0, 5)} - ${row.end_time.slice(0, 5)}`,
        }));
    } catch (error) {
        console.error("日単位の空き状況取得に失敗しました:", error);
        throw error;
    }
};


// slotIdに基づいて現在の予約人数を取得
exports.getCurrentReservationCount = async (slotId) => {
    const query = `
        SELECT IFNULL(SUM(group_size), 0) AS currentCount
        FROM reservations
        WHERE slot_id = ?
    `;
    const [rows] = await db.query(query, [slotId]);
    return rows[0].currentCount;
};