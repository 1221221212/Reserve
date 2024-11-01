const mysql = require('mysql2/promise'); // mysql2/promise を読み込み

const db = mysql.createPool({
    host: 'localhost',
    user: 'reservation_user', // ユーザー名
    password: 'naonao',       // パスワード
    database: 'reservation_app_db' // データベース名
});

db.getConnection()
.then(() => console.log("データベース接続に成功しました"))
.catch((error) => console.error("データベース接続に失敗しました:", error));


module.exports = db;