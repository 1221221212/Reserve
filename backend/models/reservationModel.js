// reservationModel.js

const db = require('./db'); // データベース接続

// トランザクションを使用した予約作成
exports.createReservation = async ({ slot_id, customer_name, phone_number, email, group_size }) => {
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
            INSERT INTO reservations (slot_id, customer_name, phone_number, email, group_size)
            VALUES (?, ?, ?, ?, ?)
        `, [slot_id, customer_name, phone_number, email, group_size]);

        await connection.commit();

        console.log("予約が正常に作成されました");

        return {
            success: true,
            reservation: {
                id: result.insertId,
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
