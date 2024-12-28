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

// 重複チェック
exports.checkDuplicates = async (organizedSlots) => {
    try {
        const dates = Object.keys(organizedSlots); // 日付リスト
        const patternIds = Array.from(
            new Set(dates.flatMap(date => organizedSlots[date]))
        ); // Pattern IDリスト（ユニーク）

        // SQLクエリで既存データを取得
        const query = `
            SELECT DATE_FORMAT(date, '%Y-%m-%d') as date, pattern_id
            FROM assigned_slots
            WHERE date IN (${dates.map(() => '?').join(',')})
              AND pattern_id IN (${patternIds.map(() => '?').join(',')})
              AND status = 'active'
        `;
        const values = [...dates, ...patternIds];
        const [rows] = await db.query(query, values);

        // 既存データを Set に変換 (日付を YYYY-MM-DD に統一)
        const existingSlots = new Set(rows.map(row => `${row.date}-${row.pattern_id}`));

        // 新規に挿入するデータを抽出
        const newSlots = [];
        for (const [date, patternIds] of Object.entries(organizedSlots)) {
            for (const patternId of patternIds) {
                const key = `${date}-${patternId}`;
                if (!existingSlots.has(key)) {
                    newSlots.push({ date, patternId });
                }
            }
        }

        return newSlots; // 新規スロットのみ返す
    } catch (error) {
        console.error('重複チェックエラー:', error);
        throw error;
    }
};

// 予約枠を一括挿入
exports.createAssignedSlots = async (slots) => {
    try {
        if (slots.length === 0) return;

        // 挿入用の値を準備
        const values = slots.map(slot => [slot.date, slot.patternId, 'active']);

        const query = `
            INSERT INTO assigned_slots (date, pattern_id, status)
            VALUES ?
        `;
        await db.query(query, [values]);

        console.log(`${slots.length}件の予約枠を挿入しました`);
    } catch (error) {
        console.error('予約枠の一括挿入エラー:', error);
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

exports.getMonthlySlots = async (year, month) => {
    const query = `
        SELECT 
            assigned_slots.date,
            reservation_patterns.id AS pattern_id,
            COUNT(reservations.id) AS reservation_count
        FROM assigned_slots
        LEFT JOIN reservation_patterns ON assigned_slots.pattern_id = reservation_patterns.id
        LEFT JOIN reservations ON assigned_slots.id = reservations.slot_id
        WHERE YEAR(assigned_slots.date) = ? AND MONTH(assigned_slots.date) = ?
        GROUP BY assigned_slots.date, reservation_patterns.id
        ORDER BY assigned_slots.date;
    `;

    const [rows] = await db.query(query, [year, month]);
    return rows;
};

exports.getDailySlots = async (date) => {
    try {
        const query = `
            SELECT 
                assigned_slots.id,
                reservation_patterns.start_time,
                reservation_patterns.end_time,
                assigned_slots.status,
                COUNT(reservations.id) AS reservation_count
            FROM assigned_slots
            INNER JOIN reservation_patterns 
                ON assigned_slots.pattern_id = reservation_patterns.id
            LEFT JOIN reservations 
                ON assigned_slots.id = reservations.slot_id
            WHERE assigned_slots.date = ?
            GROUP BY assigned_slots.id, reservation_patterns.start_time, reservation_patterns.end_time, assigned_slots.status
            ORDER BY reservation_patterns.start_time;
        `;

        const [rows] = await db.query(query, [date]);
        return rows;
    } catch (error) {
        console.error('日付ごとのスロット情報取得エラー:', error);
        throw error;
    }
};

