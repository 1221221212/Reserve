const Comment = require('../models/commentsModel');

exports.createComment = async (req, res) => {
    const { reservation_id, comment, isSystem } = req.body; // フロントから `isSystem` を受け取る
    const user_id = isSystem ? null : req.user?.id; // `isSystem` が true の場合は `null`

    if (!reservation_id || !comment) {
        return res.status(400).json({ message: "予約IDとコメント内容は必須です。" });
    }

    try {
        const commentId = await Comment.create({ reservation_id, user_id, comment });
        res.status(201).json({
            message: "コメントが作成されました。",
            comment_id: commentId,
        });
    } catch (error) {
        console.error("コメント作成エラー:", error);
        res.status(500).json({ message: "コメント作成に失敗しました", error });
    }
};

exports.getCommentsByReservation = async (req, res) => {
    const { reservation_id } = req.params;

    try {
        const comments = await Comment.getByReservationId(reservation_id);
        res.status(200).json(comments);
    } catch (error) {
        console.error("コメント取得エラー:", error);
        res.status(500).json({ message: "コメント取得に失敗しました", error });
    }
};
