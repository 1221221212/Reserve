// src/models/settingsModel.js
const db = require('./db');

// 設定情報を取得
exports.getSettings = async () => {
    const [rows] = await db.query("SELECT settings_data FROM Settings WHERE id = 1");

    if (rows.length) {
        try {
            return typeof rows[0].settings_data === 'string'
                ? JSON.parse(rows[0].settings_data)
                : rows[0].settings_data;
        } catch (error) {
            console.error("設定情報のJSON解析に失敗しました:", error);
            throw error;
        }
    }
    return null;
};

// 設定情報を保存
exports.saveSettings = async (settingsData) => {
    const jsonData = JSON.stringify(settingsData);
    await db.query(
        "INSERT INTO Settings (id, settings_data) VALUES (1, ?) ON DUPLICATE KEY UPDATE settings_data = ?",
        [jsonData, jsonData]
    );
};
