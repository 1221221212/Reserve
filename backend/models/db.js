const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'reservation_user',
    password: 'naonao',              // 正しいパスワードを設定
    database: 'reservation_app_db'  // 正確なデータベース名
});

db.connect((err) => {
    if (err) {
        console.error('データベース接続エラー:', err);
    } else {
        console.log('データベースに接続しました');
    }
});

module.exports = db;