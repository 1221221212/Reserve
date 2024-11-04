// backend/controllers/reservationController.js

const reservationModel = require('../models/reservationModel');

// 新規予約作成
exports.createReservation = async (req, res) => {
    try {
        const { slot_id, customer_name, phone_number, email, group_size } = req.body;

        // 入力バリデーション
        if (!slot_id || !customer_name || !phone_number || !email || !group_size) {
            return res.status(400).json({ success: false, message: "すべてのフィールドを入力してください" });
        }

        // 予約の作成
        const result = await reservationModel.createReservation({
            slot_id,
            customer_name,
            phone_number,
            email,
            group_size,
        });

        // 予約が成功したかどうかを確認
        if (result.success) {
            return res.status(201).json({ success: true, message: "予約が作成されました", reservation: result.reservation });
        } else {
            // 予約が満員でブロックされた場合
            return res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error("予約の作成に失敗しました:", error);
        res.status(500).json({ success: false, message: "予約の作成に失敗しました", error: error.message });
    }
};
