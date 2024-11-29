const mysql = require('mysql2/promise');
const tunnel = require('tunnel-ssh');
require('dotenv').config();  // dotenvを読み込み

// SSH接続の設定
const sshConfig = {
    username: process.env.SSH_USER,  // XserverのSSHユーザー名
    privateKey: Buffer.from(process.env.SSH_PRIVATE_KEY, 'utf-8'),  // 環境変数から秘密鍵を取得
    host: 'iw33.xsrv.jp',  // XserverのSSHホスト
    port: 10022,  // SSH接続ポート（デフォルトは10022）
    dstHost: '127.0.0.1',  // MySQLが動作しているホスト
    dstPort: 3306,  // MySQLポート（デフォルトは3306）
};

// SSHトンネルを作成してMySQLに接続
const db = async () => {
    try {
        // SSHトンネルを開く
        const server = await new Promise((resolve, reject) => {
            tunnel(sshConfig, (error, server) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(server);
                }
            });
        });

        // トンネル経由でMySQLに接続
        const connection = await mysql.createPool({
            host: '127.0.0.1',  // ローカルホスト経由
            user: process.env.DB_USER,  // 環境変数からDBユーザー
            password: process.env.DB_PASSWORD,  // 環境変数からDBパスワード
            database: process.env.DB_NAME,  // 環境変数からDB名
            port: 3306,  // ローカルのポート
        });

        console.log("データベース接続に成功しました");
        return connection;
    } catch (error) {
        console.error("データベース接続に失敗しました:", error);
    }
};

// データベース接続を確認
db().then((connection) => {
    // 接続が成功した場合に行いたい処理をここに記述
});

module.exports = db;
