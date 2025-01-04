const db = require('./db');

const Comment = {
    async create({ reservation_id, user_id, comment }) {
        const query = `
            INSERT INTO admin_comment (reservation_id, user_id, comment, created_at)
            VALUES (?, ?, ?, NOW())
        `;
        const [result] = await db.execute(query, [reservation_id, user_id, comment]);
        return result.insertId; // 新しいコメントのIDを返す
    },

    async getByReservationId(reservation_id) {
        const query = `
            SELECT ac.id, ac.reservation_id, ac.user_id, ac.comment, ac.created_at, 
                   CASE WHEN ac.user_id IS NULL THEN 'System' ELSE u.username END AS username
            FROM admin_comment ac
            LEFT JOIN users u ON ac.user_id = u.id
            WHERE ac.reservation_id = ?
        `;
        const [rows] = await db.execute(query, [reservation_id]);
        return rows; // コメント一覧を返す
    },
};

module.exports = Comment;
