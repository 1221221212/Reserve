const db = require('./db');

exports.getAllAssignedSlots = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM assigned_slots');
        return rows;
    } catch (error) {
        console.error('予約枠データの取得エラー:', error);
        throw error;
    }
};

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
