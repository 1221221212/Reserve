// backend/controllers/reservationController.js

const reservationModel = require('../models/reservationModel');
const DateUtil = require('../utils/dateUtils')

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

// 予約情報取得
exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await reservationModel.getAllReservations();

        // 各予約情報の日付を整形
        const formattedReservations = reservations.map((reservation) => ({
            ...reservation,
            created_at: DateUtil.utcToJstDate(reservation.created_at), // 作成日を整形
            reservation_date: DateUtil.utcToJstDate(reservation.reservation_date), // 予約日を整形
            start_time: DateUtil.removeSecond(reservation.start_time), // 開始時間を整形
            end_time: DateUtil.removeSecond(reservation.end_time), // 終了時間を整形
        }));

        res.status(200).json(formattedReservations);
    } catch (error) {
        console.error("予約情報の取得に失敗しました:", error);
        res.status(500).json({ success: false, message: "予約情報の取得に失敗しました", error: error.message });
    }
};

// フィルターされた予約情報を取得
exports.getFilteredReservations = async (req, res) => {
    try {
        const { startDate, endDate, reservationId, customerName, phoneNumber, email, status } = req.query;

        let reservations;

        if (reservationId) {
            // 予約IDでのみフィルタリング
            reservations = await reservationModel.getReservationById(reservationId);
        } else {
            // その他の条件でフィルタリング
            reservations = await reservationModel.getFilteredReservations({
                startDate,
                endDate,
                customerName,
                phoneNumber,
                email,
                status,
            });
        }

        // 各予約情報の日付を整形
        const formattedReservations = reservations.map((reservation) => ({
            ...reservation,
            created_at: DateUtil.utcToJstDate(reservation.created_at),
            reservation_date: DateUtil.utcToJstDate(reservation.reservation_date),
            start_time: DateUtil.removeSecond(reservation.start_time),
            end_time: DateUtil.removeSecond(reservation.end_time),
        }));

        res.status(200).json(formattedReservations);
    } catch (error) {
        console.error("フィルターされた予約情報の取得に失敗しました:", error);
        res.status(500).json({ message: "予約情報の取得に失敗しました", error: error.message });
    }
};