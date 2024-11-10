const db = require('./db'); // データベース接続

// 予約番号用ランダム3文字の英数字生成関数
const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 3; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// トランザクションを使用した予約作成
exports.createReservation = async ({ slot_id, customer_name, phone_number, email, group_size }) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 制限内であれば予約を挿入
        const [result] = await connection.query(`
            INSERT INTO reservations (slot_id, customer_name, phone_number, email, group_size)
            VALUES (?, ?, ?, ?, ?)
        `, [slot_id, customer_name, phone_number, email, group_size]);

        const reservationId = result.insertId; // 自動生成された予約ID
        const randomCode = generateRandomCode(); // ランダムな3文字の英数字生成
        const reservationNumber = `R${randomCode}${reservationId}`; // "R-ランダム3文字-予約ID"形式の予約番号

        // 生成した予約番号を更新
        await connection.query(`
            UPDATE reservations SET reservation_number = ? WHERE id = ?
        `, [reservationNumber, reservationId]);

        await connection.commit();

        return {
            success: true,
            reservation: {
                id: reservationId,
                reservation_number: reservationNumber,
                slot_id,
                customer_name,
                phone_number,
                email,
                group_size,
            },
        };
    } catch (error) {
        await connection.rollback();
        console.error("予約作成トランザクションエラー:", error);
        throw error;
    } finally {
        connection.release();
    }
};


// すべての予約情報を取得
exports.getAllReservations = async () => {
    try {
        const [reservations] = await db.query(`
            SELECT 
                reservations.id,
                reservations.reservation_number,
                reservations.customer_name,
                reservations.phone_number,
                reservations.email,
                reservations.group_size,
                reservations.status,
                reservations.created_at,
                assigned_slots.date AS reservation_date,
                reservation_patterns.start_time,
                reservation_patterns.end_time
            FROM reservations
            JOIN assigned_slots ON reservations.slot_id = assigned_slots.id
            JOIN reservation_patterns ON assigned_slots.pattern_id = reservation_patterns.id
        `);
        return reservations;
    } catch (error) {
        console.error("すべての予約情報の取得に失敗しました:", error);
        throw error;
    }
};

// 予約IDで予約情報を取得
exports.getReservationById = async (reservationId) => {
    try {
        const [reservations] = await db.query(`
            SELECT 
                reservations.id,
                reservations.reservation_number,
                reservations.customer_name,
                reservations.phone_number,
                reservations.email,
                reservations.group_size,
                reservations.status,
                reservations.created_at,
                assigned_slots.date AS reservation_date,
                reservation_patterns.start_time,
                reservation_patterns.end_time
            FROM reservations
            JOIN assigned_slots ON reservations.slot_id = assigned_slots.id
            JOIN reservation_patterns ON assigned_slots.pattern_id = reservation_patterns.id
            WHERE reservations.reservation_number = ?
        `, [reservationId]);

        return reservations;
    } catch (error) {
        console.error("予約IDでの予約情報の取得に失敗しました:", error);
        throw error;
    }
};

// 条件に基づいたフィルター付き予約情報を取得
exports.getFilteredReservations = async ({ startDate, endDate, customerName, phoneNumber, email, status }) => {
    try {
        let query = `
            SELECT 
                reservations.id,
                reservations.reservation_number,
                reservations.customer_name,
                reservations.phone_number,
                reservations.email,
                reservations.group_size,
                reservations.status,
                reservations.created_at,
                assigned_slots.date AS reservation_date,
                reservation_patterns.start_time,
                reservation_patterns.end_time
            FROM reservations
            JOIN assigned_slots ON reservations.slot_id = assigned_slots.id
            JOIN reservation_patterns ON assigned_slots.pattern_id = reservation_patterns.id
            WHERE assigned_slots.date BETWEEN ? AND ?
        `;
        const params = [startDate, endDate];

        if (customerName) {
            query += ` AND reservations.customer_name LIKE ?`;
            params.push(`%${customerName}%`);
        }
        if (phoneNumber) {
            query += ` AND reservations.phone_number LIKE ?`;
            params.push(`%${phoneNumber}%`);
        }
        if (email) {
            query += ` AND reservations.email LIKE ?`;
            params.push(`%${email}%`);
        }
        if (status) {
            query += ` AND reservations.status = ?`;
            params.push(status);
        }

        const [reservations] = await db.query(query, params);
        return reservations;
    } catch (error) {
        console.error("条件に基づく予約情報の取得に失敗しました:", error);
        throw error;
    }
};