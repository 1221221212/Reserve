// models/reservationModel.js

const db = require('./db'); // データベース接続

// 新規予約作成
exports.createReservation = async ({ slot_id, customer_name, phone_number, email, group_size }) => {
    const query = `
        INSERT INTO reservations (slot_id, customer_name, phone_number, email, group_size)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [slot_id, customer_name, phone_number, email, group_size]);
    return { id: result.insertId, slot_id, customer_name, phone_number, email, group_size };
};
