// backend/controllers/reservationController.js

const reservationModel = require('../models/reservationModel');
const util = require('../utils/utils');
const reservationService = require('../services/reservationService');
const { sendReservationConfirmation } = require('../services/emailSevice');
const { notifyReservationCreated } = require('../services/LINEService');

/**
 * スロットの予約可否を確認
 * @param {object} req - リクエストオブジェクト
 * @param {object} res - レスポンスオブジェクト
 */
exports.checkAvailability = async (req, res) => {
    try {
        const { slot_id, reservation_settings } = req.body;

        // リクエストデータのバリデーション
        if (!slot_id || !reservation_settings) {
            return res.status(400).json({ success: false, message: "slot_id と reservation_settings は必須です。" });
        }

        // サービス層を呼び出して可否を確認
        const availability = await reservationService.checkSlotAvailability(slot_id, reservation_settings);

        // 結果に応じたレスポンスを返す
        if (availability.available) {
            return res.status(200).json({ success: true, message: "予約可能です。" });
        } else {
            return res.status(400).json({ success: false, message: availability.message });
        }
    } catch (error) {
        console.error("予約可否確認中にエラーが発生しました:", error);
        return res.status(500).json({ success: false, message: "予約可否確認中にエラーが発生しました。" });
    }
};

// 新規予約作成
exports.createReservation = async (req, res) => {
    try {
        const { slot_id, customer_name, phone_number, email, group_size, comment } = req.body;

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
            comment,
        });

        // 予約が成功した場合
        if (result.success) {
            // メール送信
            try {
                await sendReservationConfirmation(email, {
                    reservation_number: result.reservation.reservation_number,
                    customer_name,
                    date: result.reservation.date,
                    start_time: result.reservation.start_time,
                    end_time: result.reservation.end_time,
                    group_size,
                });
            } catch (emailError) {
                console.error("メール送信中にエラーが発生しました:", emailError.message);
                // メール送信に失敗しても予約は成功したので、エラーにはしない
            }

            try{
                await notifyReservationCreated({
                    reservation_number: result.reservation.reservation_number,
                    id: result.reservation.id,
                    customer_name,
                    date: result.reservation.date,
                    start_time: result.reservation.start_time,
                    end_time: result.reservation.end_time,
                    comment,
                })
            } catch (emailError) {
                console.error("LINE通知送信中にエラーが発生しました:", emailError.message);
                // LINE送信に失敗しても予約は成功したので、エラーにはしない
            }

            return res.status(201).json({
                success: true,
                message: "予約が作成されました",
                reservation: result.reservation,
            });
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
            created_at: util.utcToJstDate(reservation.created_at), // 作成日を整形
            reservation_date: util.utcToJstDate(reservation.reservation_date), // 予約日を整形
            start_time: util.removeSecond(reservation.start_time), // 開始時間を整形
            end_time: util.removeSecond(reservation.end_time), // 終了時間を整形
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
        const { startDate, endDate, reservationId, customerName, phoneNumber, email, status, hasComment, slot_id } = req.query;

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
                hasComment,
                slot_id,
            });
        }

        // 各予約情報の日付を整形
        const formattedReservations = reservations.map((reservation) => ({
            ...reservation,
            reservation_date: util.utcToJstDate(reservation.reservation_date),
            start_time: util.removeSecond(reservation.start_time),
            end_time: util.removeSecond(reservation.end_time),
        }));

        res.status(200).json(formattedReservations);
    } catch (error) {
        console.error("フィルターされた予約情報の取得に失敗しました:", error);
        res.status(500).json({ message: "予約情報の取得に失敗しました", error: error.message });
    }
};

exports.getReservationDetail = async (req, res) => {
    try {
        const reservationId = req.params.id;
        const reservation = await reservationModel.getReservationDetail(reservationId);

        if (!reservation) {
            return res.status(404).json({ message: "予約が見つかりませんでした" });
        }

        // 日付と時間をフォーマットする
        const formattedReservation = {
            ...reservation,
            created_at: util.utcToJstDate(reservation.created_at),
            reservation_date: util.utcToJstDate(reservation.reservation_date),
            start_time: util.removeSecond(reservation.start_time),
            end_time: util.removeSecond(reservation.end_time),
        };

        res.status(200).json(formattedReservation);
    } catch (error) {
        console.error("予約詳細の取得に失敗しました:", error);
        res.status(500).json({ message: "予約の取得に失敗しました", error: error.message });
    }
};

exports.cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;

        // モデルを呼び出して予約をキャンセル
        const result = await reservationModel.cancelReservationById(id);

        if (result.success) {
            return res.status(200).json({ success: true, message: "予約をキャンセルしました。" });
        } else {
            return res.status(404).json({ success: false, message: "予約が見つかりませんでした。" });
        }
    } catch (error) {
        console.error("予約キャンセル中にエラーが発生しました:", error);
        return res.status(500).json({ success: false, message: "予約キャンセル中にエラーが発生しました。" });
    }
};

exports.getMonthlyReservationCounts = async (req, res) => {
    const { year, month } = req.query;

    if (!year || !month) {
        return res.status(400).json({ message: 'year と month は必須です' });
    }

    try {
        const reservations = await reservationModel.getMonthlyReservationCounts(year, month);
        res.status(200).json(reservations);
    } catch (error) {
        console.error("月ごとの予約件数取得エラー:", error);
        res.status(500).json({ message: "月ごとの予約件数取得に失敗しました", error: error.message });
    }
};

exports.getDailyReservationCounts = async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: 'date は必須です' });
    }

    try {
        const reservations = await reservationModel.getDailyReservationCounts(date);
        res.status(200).json({ date, slots: reservations });
    } catch (error) {
        console.error("日ごとの予約枠ごとの予約件数取得エラー:", error);
        res.status(500).json({ message: "日ごとの予約枠ごとの予約件数取得に失敗しました", error: error.message });
    }
};
