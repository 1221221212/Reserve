// models/patternModel.js

const db = require('./db'); // データベース接続

// パターンを作成するメソッド
exports.createPattern = async ({ pattern_name, start_time, end_time, max_groups, max_people_per_group }) => {
    try {
        const query = `INSERT INTO reservation_patterns (pattern_name, start_time, end_time, max_groups, max_people_per_group) VALUES (?, ?, ?, ?, ?)`;
        const [results] = await db.query(query, [pattern_name, start_time, end_time, max_groups, max_people_per_group]);
        return { id: results.insertId, pattern_name, start_time, end_time, max_groups, max_people_per_group };
    } catch (error) {
        console.error("パターンの作成に失敗しました:", error);
        throw error;
    }
};

// すべてのパターンを取得するメソッド
exports.getPatterns = async () => {
    try {
        const query = 'SELECT * FROM reservation_patterns';
        const [rows] = await db.query(query);
        console.log("取得したパターン:", rows); // デバッグ用
        return rows;
    } catch (error) {
        console.error("パターンの取得に失敗しました:", error);
        throw error;
    }
};
