const mysql = require('mysql2/promise');
const tunnel = require('tunnel-ssh');



// SSHトンネル設定
const sshConfig = {
    username: process.env.SSH_USER,
    privateKey: process.env.SSH_KEY, // 環境変数から復元した秘密鍵を使用
    host: 'iw33.xsrv.jp',
    port: 10022,
    dstHost: '127.0.0.1',
    dstPort: 3306,
};

// 接続プールを初期化する変数
let pool;

// SSHトンネルとMySQLプールを初期化
const initializeDB = async () => {
    try {
        // SSHトンネルを確立
        await new Promise((resolve, reject) => {
            tunnel(sshConfig, (error, server) => {
                if (error) {
                    console.error("SSHトンネルエラー:", error);
                    return reject(error);
                }
                console.log("SSHトンネルが正常に開かれました");
                resolve(server);
            });
        });

        // MySQL接続プールを作成
        pool = mysql.createPool({
            host: '127.0.0.1',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: 3306,
        });

        console.log("データベース接続に成功しました");
    } catch (error) {
        console.error("接続エラー:", error);
        throw error;
    }
};

// 接続プールを取得する関数
const getDB = () => {
    if (!pool) {
        throw new Error("データベース接続が初期化されていません。initializeDBを実行してください。");
    }
    return pool;
};

// initializeDBとgetDBをエクスポート
module.exports = {
    initializeDB,
    getDB,
};
