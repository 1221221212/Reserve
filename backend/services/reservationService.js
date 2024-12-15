const moment = require('moment');
const reservationModel = require('../models/reservationModel');
const { reservationPeriod } = require('../utils/utils');

/**
 * スロットの予約可否を確認
 * @param {number} slot_id - スロットのID
 * @param {object} reservation_settings - 予約設定
 * @returns {object} - { available: boolean, message: string }
 */
exports.checkSlotAvailability = async (slot_id, reservation_settings) => {
    try {
        // スロット詳細の取得
        const slotDetails = await reservationModel.getSlotDetails(slot_id);
        if (!slotDetails) {
            return { available: false, message: "スロットが見つかりません。" };
        }

        const { date, start_time, slot_status, pattern_status } = slotDetails;

        // ステータスチェック
        if (slot_status !== 'active' || pattern_status !== 'active') {
            return { available: false, message: "スロットまたはパターンが無効です。" };
        }

        // 予約可能期間を計算
        const { available_since, available_since_time, available_until } = reservationPeriod(reservation_settings);

        // 予約可能期間情報をフォーマット
        const reservationPeriodInfo = {
            available_since: available_since.format('YYYY-MM-DD'),
            available_since_time: reservation_settings.end.isSameDay
                ? available_since_time?.format('HH:mm')
                : null,
            available_until: available_until.format('YYYY-MM-DD'),
        };

        console.log("予約可能期間:", reservationPeriodInfo);

        // 今日の日付の開始時刻を取得
        const currentDate = moment().startOf('day');

        // slotDate を Moment オブジェクトとして作成
        const slotDate = moment(date, 'YYYY-MM-DD');

        // slotTime を Moment オブジェクトとして作成
        const slotTime = moment(`${slotDate.format('YYYY-MM-DD')} ${start_time}`, 'YYYY-MM-DD HH:mm');

        // 過去日付チェック
        if (slotDate.isBefore(currentDate)) {
            return { available: false, message: "スロットはすでに過ぎています。" };
        }

        // 本日の場合
        if (slotDate.isSame(currentDate, 'day')) {
            if (reservation_settings.end.isSameDay) {
                // available_since_time を Moment オブジェクトに変換
                const availableSinceMoment = moment(available_since_time, 'HH:mm');

                // 時間比較
                if (slotTime.isAfter(availableSinceMoment)) {
                    return { available: true };
                } else {
                    return { available: false, message: "当日の受付時間外です。" };
                }
            } else {
                return { available: false, message: "当日予約は不可です。" };
            }
        }

        // 未来の日付の場合
        if (
            slotDate.isSame(available_since, 'day') || 
            slotDate.isSame(available_until, 'day') ||
            slotDate.isBetween(available_since, available_until, null, '()')
        ) {
            return { available: true };
        } else {
            return { available: false, message: "予約可能期間外です。" };
        }
    } catch (error) {
        console.error("予約可否確認中にエラーが発生しました:", error);
        throw error;
    }
};
