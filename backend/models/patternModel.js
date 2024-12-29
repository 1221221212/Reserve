// src/models/patternModel.js
const db = require('./db'); // データベース接続

// パターンを作成するメソッド
exports.createPattern = async ({ pattern_name, start_time, end_time, max_groups, max_people }) => {
    try {
        const query = `INSERT INTO reservation_patterns (pattern_name, start_time, end_time, max_groups, max_people) VALUES (?, ?, ?, ?, ?)`;
        const [results] = await db.query(query, [
            pattern_name,
            start_time,
            end_time,
            max_groups !== null ? max_groups : null, 
            max_people
        ]);
        return { id: results.insertId, pattern_name, start_time, end_time, max_groups, max_people };
    } catch (error) {
        console.error("パターンの作成に失敗しました:", error);
        throw error;
    }
};

// すべてのアクティブなパターンを取得するメソッド
exports.getPatterns = async () => {
    try {
        const query = `
            SELECT * FROM reservation_patterns
            WHERE status = 'active'
        `;
        const [rows] = await db.query(query);
        return rows.map(row => ({
            ...row,
            start_time: row.start_time,
            end_time: row.end_time
        }));
    } catch (error) {
        console.error("パターンの取得に失敗しました:", error);
        throw error;
    }
};

// 重複パターンのチェック
exports.isPatternDuplicate = async ({ start_time, end_time, max_groups, max_people }) => {
    try {
        const query = `
            SELECT COUNT(*) AS count
            FROM reservation_patterns
            WHERE start_time = ? AND end_time = ? AND max_groups = ? AND max_people = ? AND status = 'active'
        `;
        const [results] = await db.query(query, [start_time, end_time, max_groups, max_people]);
        return results[0].count > 0; // 重複がある場合はtrue
    } catch (error) {
        console.error("重複パターンのチェックに失敗しました:", error);
        throw error;
    }
};

// パターンのステータスを更新
exports.updatePatternStatus = async (id, status) => {
    try {
        const query = `UPDATE reservation_patterns SET status = ? WHERE id = ?`;
        const [result] = await db.query(query, [status, id]);
        return result;
    } catch (error) {
        console.error("ステータスの更新に失敗しました:", error);
        throw error;
    }
};
