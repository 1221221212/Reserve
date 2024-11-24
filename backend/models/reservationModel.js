const db = require('./db'); // データベース接続

// ランダム3文字の英数字生成関数
const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 3; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// トランザクションを使用した予約作成
exports.createReservation = async ({ slot_id, customer_name, phone_number, email, group_size, comment }) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 現在の予約組数と人数を確認（行ロックをかける）
        const [currentReservations] = await connection.query(`
            SELECT COUNT(id) AS current_groups, IFNULL(SUM(group_size), 0) AS current_people
            FROM reservations
            WHERE slot_id = ?
            FOR UPDATE
        `, [slot_id]);

        const currentGroups = parseInt(currentReservations[0]?.current_groups || 0);
        const currentPeople = parseInt(currentReservations[0]?.current_people || 0);

        // スロットの最大組数と最大人数を取得
        const [slotInfo] = await connection.query(`
            SELECT max_groups, max_people
            FROM reservation_patterns
            WHERE id = (SELECT pattern_id FROM assigned_slots WHERE id = ?)
        `, [slot_id]);

        if (!slotInfo[0]) {
            console.log("slotInfo[0] is undefined");
            await connection.rollback();
            return { success: false, message: "予約枠の情報が取得できませんでした。" };
        }

        const { max_groups, max_people } = slotInfo[0];

        // 満員チェック
        if (max_groups && currentGroups >= max_groups) {
            console.log("最大組数に達しているため予約を拒否");
            await connection.rollback();
            return { success: false, message: "この予約枠は満員です (最大組数に達しました)" };
        }
        if (!max_groups && max_people && (currentPeople + group_size > max_people)) {
            console.log("最大人数に達しているため予約を拒否");
            await connection.rollback();
            return { success: false, message: "この予約枠は満員です (最大人数に達しました)" };
        }

        // 制限内であれば予約を挿入
        const [result] = await connection.query(`
            INSERT INTO reservations (slot_id, customer_name, phone_number, email, group_size, comment)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [slot_id, customer_name, phone_number, email, group_size, comment]);

        const reservationId = result.insertId; // 自動生成された予約ID
        const randomCode = generateRandomCode(); // ランダムな3文字の英数字生成
        const reservationNumber = `R${randomCode}${reservationId}`; // "R-ランダム3文字-予約ID"形式の予約番号

        // 生成した予約番号を更新
        await connection.query(`
            UPDATE reservations SET reservation_number = ? WHERE id = ?
        `, [reservationNumber, reservationId]);

        await connection.commit();

        console.log("予約が正常に作成されました");

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
                comment,
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
                reservations.comment,
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
                reservations.group_size,
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


exports.getReservationDetail = async (id) => {
    try {
        const [reservations] = await db.query(`
            SELECT 
                reservations.id,
                reservations.reservation_number,
                reservations.customer_name,
                reservations.phone_number,
                reservations.email,
                reservations.group_size,
                reservations.comment,
                reservations.status,
                reservations.created_at,
                assigned_slots.date AS reservation_date,
                reservation_patterns.start_time,
                reservation_patterns.end_time
            FROM reservations
            JOIN assigned_slots ON reservations.slot_id = assigned_slots.id
            JOIN reservation_patterns ON assigned_slots.pattern_id = reservation_patterns.id
            WHERE reservations.id = ?
        `, [id]);

        return reservations[0]; // 1件だけ返す
    } catch (error) {
        console.error("予約IDでの予約情報の取得に失敗しました:", error);
        throw error;
    }
};
