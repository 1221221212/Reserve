const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

// コメント作成
router.post('/', commentsController.createComment);

// 予約IDに紐づくコメント取得
router.get('/:reservation_id', commentsController.getCommentsByReservation);

module.exports = router;
