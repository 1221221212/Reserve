const db = require('./db');

// 全ての予約枠を取得 (JOINでパターン情報を含める)
exports.getAllAssignedSlots = async () => {
    try {
        const query = `
            SELECT 
                assigned_slots.id,
                assigned_slots.date,
                reservation_patterns.pattern_name,
                reservation_patterns.start_time,
                reservation_patterns.end_time,
                reservation_patterns.max_groups,
                reservation_patterns.max_people
            FROM assigned_slots
            LEFT JOIN reservation_patterns 
            ON assigned_slots.pattern_id = reservation_patterns.id
            ORDER BY assigned_slots.date, reservation_patterns.start_time;
        `;
        
        const [rows] = await db.query(query);
        return rows;
    } catch (error) {
        console.error('予約枠データの取得エラー:', error);
        throw error;
    }
};

// 予約枠を作成
exports.createAssignedSlot = async (slotData) => {
    const { date, patternId } = slotData;
    try {
        const [result] = await db.query(
            'INSERT INTO assigned_slots (date, pattern_id) VALUES (?, ?)',
            [date, patternId]
        );
        return result;
    } catch (error) {
        console.error('予約枠の作成エラー:', error);
        throw error;
    }
};

exports.updateSlotsStatus = async (slotIds, status) => {
    try {
        // `status` が許容される値か確認
        if (!['active', 'suspend', 'close', 'inactive'].includes(status)) {
            throw new Error(`Invalid status value: ${status}`);
        }

        const query = `UPDATE assigned_slots SET status = ? WHERE id IN (${slotIds.map(() => '?').join(',')})`;
        const [result] = await db.query(query, [status, ...slotIds]);
        return result;
    } catch (error) {
        console.error('複数スロットステータスの更新エラー:', error);
        throw error;
    }
};