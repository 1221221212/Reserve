const db = require('./db');
const { utcToJstDate } = require('../utils/utils');

// 休業日を作成
exports.create = async (data) => {
    const query = `
        INSERT INTO closed_days (type, day_of_week, week_of_month, day_of_month, month_of_year, date, reason)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        data.type || null,
        data.day_of_week || null,
        data.week_of_month || null,
        data.day_of_month || null,
        data.month_of_year || null,
        data.date || null,
        data.reason || null
    ];
    const [result] = await db.execute(query, values);
    return result.insertId;
};

// すべての休業日を取得
exports.getAll = async () => {
    const query = `SELECT * FROM closed_days`;
    const [rows] = await db.execute(query);
    return rows;
};

// 臨時休業日を指定期間内で取得
exports.getTemporaryInRange = async (startDate, endDate) => {
    const query = `
        SELECT date, 'temporary' as type
        FROM closed_days
        WHERE type = 'temporary' AND date BETWEEN ? AND ?
    `;
    const [rows] = await db.execute(query, [startDate, endDate]);
    return rows.map((row) => ({
        ...row,
        date: utcToJstDate(row.date),
    }));
};

// 全ての定休日を取得
exports.getRegular = async () => {
    const query = `
        SELECT *
        FROM closed_days
        WHERE type IN ('regular_weekly', 'regular_monthly', 'regular_yearly')
    `;
    const [rows] = await db.execute(query);
    return rows;
};

// 特定日付の臨時休業日取得
exports.getTemporaryByDate = async (date) => {
    const query = `
        SELECT *
        FROM closed_days
        WHERE type = 'temporary' AND date = ?
    `;
    const [rows] = await db.execute(query, [date]);
    return rows[0];
};
