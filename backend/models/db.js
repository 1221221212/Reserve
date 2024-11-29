const mysql = require('mysql2/promise');
const { Client } = require('ssh2');
require('dotenv').config(); // dotenvを読み込み

// SSH接続の設定
const SSH_PRIVATE_KEY = process.env.SSH_PRIVATE_KEY;
const SSH_USER = process.env.SSH_USER;
const SSH_HOST = process.env.SSH_HOST;
const SSH_PORT = process.env.SSH_PORT;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const sshClient = new Client();

const db = mysql.createPool({
    host: '127.0.0.1',  // ローカルホストに接続
    port: 3307,         // ローカルポート（SSHトンネルを通じてMySQLに接続）
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

// DB接続を初期化する関数
const initializeDB = async () => {
    return new Promise((resolve, reject) => {
        sshClient.on('ready', () => {
            sshClient.forwardOut(
                '127.0.0.1',  // ローカルホスト
                3307,          // ローカルポート
                DB_HOST,       // リモートホスト（Xserver上のMySQL）
                DB_PORT,       // リモートポート
                (err, stream) => {
                    if (err) {
                        reject(`SSH forwarding error: ${err}`);
                        return;
                    }

                    // SSHトンネルを通じてMySQLに接続
                    mysql.createConnection({
                        user: DB_USER,
                        password: DB_PASSWORD,
                        database: DB_NAME,
                        stream: stream
                    }).then((connection) => {
                        console.log('MySQLに接続されました');
                        resolve(connection);
                    }).catch((error) => {
                        reject(`MySQL connection error: ${error}`);
                    });
                }
            );
        });

        sshClient.connect({
            host: SSH_HOST,
            port: SSH_PORT,
            username: SSH_USER,
            privateKey: SSH_PRIVATE_KEY
        });
    });
};

// `initializeDB` 関数をエクスポート
module.exports = { initializeDB, db };
