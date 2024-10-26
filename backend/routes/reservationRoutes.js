const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authenticateToken = require('../middleware/auth');

// 予約作成エンドポイント
router.post('/reservations', async (req, res) => {
    const { slot_id, customer_name, customer_email, num_people } = req.body;

    // バリデーション: 必須フィールドの確認
    if (!slot_id || !customer_name || !customer_email || !num_people) {
        return res.status(400).json({ message: 'すべての項目を入力してください。' });
    }

    // バリデーション: メールアドレスの形式確認
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
        return res.status(400).json({ message: '正しいメールアドレスを入力してください。' });
    }

    // バリデーション: 人数の確認
    if (num_people <= 0) {
        return res.status(400).json({ message: '人数は1人以上で指定してください。' });
    }

    try {
        // 新しい予約の追加
        const [result] = await db.promise().query(
            `INSERT INTO reservations (slot_id, customer_name, customer_email, num_people) VALUES (?, ?, ?, ?)`,
            [slot_id, customer_name, customer_email, num_people]
        );

        res.status(201).json({ message: '予約が作成されました。', reservationId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// 予約確認エンドポイント
router.get('/reservations/:id', async (req, res) => {
    const reservationId = req.params.id;

    try {
        // 指定された予約IDの予約情報を取得
        const [rows] = await db.promise().query(
            `SELECT * FROM reservations WHERE id = ?`,
            [reservationId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: '予約が見つかりません。' });
        }

        res.json(rows[0]); // 予約情報を返す
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// 予約キャンセルエンドポイント
router.delete('/reservations/:id', async (req, res) => {
    const reservationId = req.params.id;

    try {
        // 予約の削除
        const [result] = await db.promise().query(
            `DELETE FROM reservations WHERE id = ?`,
            [reservationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '予約が見つかりません。' });
        }

        res.json({ message: '予約がキャンセルされました。' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// 予約一覧表示とフィルタリング、ソートエンドポイント
router.get('/reservations', async (req, res) => {
    const { date, time, status, sort } = req.query; // クエリパラメータで条件を取得

    try {
        let query = 'SELECT * FROM reservations WHERE 1=1';
        const params = [];

        // 日付でフィルタリング
        if (date) {
            query += ' AND reservation_date = ?';
            params.push(date);
        }

        // 時間帯でフィルタリング
        if (time) {
            query += ' AND reservation_time = ?';
            params.push(time);
        }

        // ステータスでフィルタリング
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        // ソート
        if (sort === 'date_asc') {
            query += ' ORDER BY reservation_date ASC';
        } else if (sort === 'date_desc') {
            query += ' ORDER BY reservation_date DESC';
        } else if (sort === 'time_asc') {
            query += ' ORDER BY reservation_time ASC';
        } else if (sort === 'time_desc') {
            query += ' ORDER BY reservation_time DESC';
        }

        const [rows] = await db.promise().query(query, params);

        if (rows.length === 0) {
            return res.status(404).json({ message: '指定された条件の予約はありません。' });
        }

        res.json(rows); // フィルタリングとソート後の予約データを返す
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

module.exports = router;
