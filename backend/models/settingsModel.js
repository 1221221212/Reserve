// src/models/settingsModel.js
const db = require('./db');

// 設定情報を取得
exports.getSettings = async () => {
    const [rows] = await db.query("SELECT info_settings, reservation_settings FROM Settings WHERE id = 1");

    if (rows.length) {
        try {
            // info_settings と reservation_settings がすでに JSON オブジェクトならそのまま返す
            const infoSettings = typeof rows[0].info_settings === 'string' ? JSON.parse(rows[0].info_settings) : rows[0].info_settings;
            const reservationSettings = typeof rows[0].reservation_settings === 'string' ? JSON.parse(rows[0].reservation_settings) : rows[0].reservation_settings;

            return { infoSettings, reservationSettings };
        } catch (error) {
            console.error("設定情報のJSON解析に失敗しました:", error);
            throw error;
        }
    }
    return null;
};

// 設定情報を保存
exports.saveSettings = async (infoSettings, reservationSettings) => {
    const infoSettingsJson = JSON.stringify(infoSettings);  // InfoSettingsをJSON文字列化
    const reservationSettingsJson = JSON.stringify(reservationSettings);  // ReservationSettingsをJSON文字列化

    try {
        const result = await db.query(
            `
            INSERT INTO Settings (id, info_settings, reservation_settings) 
            VALUES (1, ?, ?)
            ON DUPLICATE KEY UPDATE info_settings = VALUES(info_settings), reservation_settings = VALUES(reservation_settings)
            `,
            [infoSettingsJson, reservationSettingsJson]  // 個別に情報を送信
        );
    } catch (error) {
        console.error("Error executing query:", error);
        throw error;
    }
};
