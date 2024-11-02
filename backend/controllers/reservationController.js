// backend/controllers/reservationController.js

const reservationModel = require('../models/reservationModel');

// 新規予約作成
exports.createReservation = async (req, res) => {
    try {
        const { slot_id, customer_name, phone_number, email, group_size } = req.body;

        // 入力バリデーション
        if (!slot_id || !customer_name || !phone_number || !email || !group_size) {
            return res.status(400).json({ message: "すべてのフィールドを入力してください" });
        }

        // 予約の作成
        const newReservation = await reservationModel.createReservation({
            slot_id,
            customer_name,
            phone_number,
            email,
            group_size,
        });

        res.status(201).json({ message: "予約が作成されました", reservation: newReservation });
    } catch (error) {
        console.error("予約の作成に失敗しました:", error);
        res.status(500).json({ message: "予約の作成に失敗しました", error });
    }
};
