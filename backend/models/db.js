const mysql = require('mysql2/promise');
require('dotenv').config(); // dotenvを読み込み

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.getConnection()
    .then(() => console.log("データベース接続に成功しました"))
    .catch((error) => console.error("データベース接続に失敗しました:", error));

module.exports = db;
