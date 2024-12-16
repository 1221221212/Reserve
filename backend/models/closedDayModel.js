const db = require('./db');
const { utcToJstDate } = require('../utils/utils');

//休業日の作成前に、既存の予約枠をチェックする
exports.checkConflicts = async (data) => {
    // ベースクエリ
    let query = `
        SELECT DISTINCT date, id AS slot_id
        FROM assigned_slots
        WHERE date >= CURDATE()
            AND status = 'active'
    `;

    const values = [];

    // 休業日のタイプに応じて条件を追加
    if (data.type === 'temporary') {
        // 臨時休業日
        query += ` AND date = ?`;
        values.push(data.date);
    } else if (data.type === 'regular_weekly') {
        // 毎週の定休日
        query += ` AND DAYNAME(date) = ?`;
        values.push(data.day_of_week);
    } else if (data.type === 'regular_monthly') {
        if (data.day_of_month) {
            // 毎月の固定日付
            query += ` AND DAY(date) = ?`;
            values.push(data.day_of_month);
        } else if (data.week_of_month && data.day_of_week) {
            // 毎月の第X曜日
            query += `
                AND WEEK(date, 1) - WEEK(DATE_SUB(date, INTERVAL DAYOFMONTH(date)-1 DAY), 1) + 1 = ?
                AND DAYNAME(date) = ?
            `;
            values.push(data.week_of_month, data.day_of_week);
        }
    } else if (data.type === 'regular_yearly') {
        // 毎年の特定日
        query += ` AND MONTH(date) = ? AND DAY(date) = ?`;
        values.push(data.month_of_year, data.day_of_month);
    }

    // データベースクエリの実行
    const [rows] = await db.execute(query, values);

    console.log(rows);

    // 日付ごとに関連する slot_id を整理
    const result = rows.reduce((acc, row) => {
        if (!acc[row.date]) {
            acc[row.date] = [];
        }
        acc[row.date].push(row.slot_id);
        return acc;
    }, {});

    console.log(result);

    // ユニークな日付とスロットIDの対応リストを返す
    return result;
};

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

// 重複するレコードを確認
exports.checkDuplicate = async (data) => {
    let query = `
        SELECT id
        FROM closed_days
        WHERE type = ?
    `;

    const values = [data.type];

    if (data.type === 'regular_weekly') {
        query += ` AND day_of_week = ?`;
        values.push(data.day_of_week);
    } else if (data.type === 'regular_monthly') {
        if (data.day_of_month) {
            query += ` AND day_of_month = ?`;
            values.push(data.day_of_month);
        } else if (data.week_of_month && data.day_of_week) {
            query += ` AND week_of_month = ? AND day_of_week = ?`;
            values.push(data.week_of_month, data.day_of_week);
        }
    } else if (data.type === 'regular_yearly') {
        query += ` AND month_of_year = ? AND day_of_month = ?`;
        values.push(data.month_of_year, data.day_of_month);
    } else if (data.type === 'temporary') {
        query += ` AND date = ?`;
        values.push(data.date);
    }

    const [rows] = await db.execute(query, values);
    return rows;
};

// 重複レコードを削除
exports.deleteDuplicates = async (ids) => {
    if (ids.length === 0) return;

    const placeholders = ids.map(() => '?').join(', ');
    const query = `DELETE FROM closed_days WHERE id IN (${placeholders})`;
    await db.execute(query, ids);
};
