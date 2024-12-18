const axios = require('axios');
require('dotenv').config();

// LINE Messaging API のチャネルアクセストークン
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const Group_ID = process.env.Group_ID;

/**
 * LINE Messaging API でメッセージを送信する関数
 * @param {string} to - 送信先の userId または groupId
 * @param {string} message - 送信するメッセージ
 */
const sendMessage = async (to, message) => {
    try {
        const response = await axios.post(
            'https://api.line.me/v2/bot/message/push',
            {
                to, // 送信先 ID
                messages: [
                    {
                        type: 'text',
                        text: message, // 送信するメッセージ
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('LINEメッセージが送信されました:', response.data);
    } catch (error) {
        console.error('LINEメッセージの送信に失敗しました:', error.response?.data || error.message);
    }
};

/**
 * 予約作成時の通知を送信する
 * @param {Object} reservation - 予約データ
 */
const notifyReservationCreated = async (reservation) => {
    const detailsUrl = `http://162.43.15.136/admin/reservations/${reservation.id}`; // 動的にURLを生成
    const message = `🔔 新しい予約が作成されました！\n
    予約ID: ${reservation.id}\n
    お客様: ${reservation.customer_name}\n
    日時: ${reservation.date} ${reservation.start_time}-${reservation.end_time}\n
    詳細: ${detailsUrl}`; // URLをメッセージに含める
    
    const recipientId = Group_ID; // 送信先 ID を設定
    await sendMessage(recipientId, message); // メッセージを送信
};


/**
 * 予約キャンセル時の通知を送信する
 * @param {Object} reservation - 予約データ
 */
const notifyReservationCanceled = async (reservation) => {
    const message = `⚠️ 予約がキャンセルされました。\n
    予約ID: ${reservation.id}\n
    お客様: ${reservation.customerName}\n
    日時: ${reservation.date} ${reservation.time}`;
    const recipientId = Group_ID; // 送信先 ID を設定
    await sendMessage(recipientId, message);
};

module.exports = {
    sendMessage,
    notifyReservationCreated,
    notifyReservationCanceled,
};