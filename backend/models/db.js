const mysql = require('mysql2/promise');
const { Client } = require('ssh2');
require('dotenv').config();

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

// SSHトンネル経由でMySQL接続プールを作成する関数
const createDBPool = (stream) => {
    return mysql.createPool({
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        stream: stream, // SSHトンネルを通じて接続
    });
};

// DB接続を初期化する関数
const initializeDB = () => {
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

                    // SSHトンネルを通じてMySQL接続プールを作成
                    const pool = createDBPool(stream);
                    console.log('MySQLに接続されました');
                    resolve(pool); // プールオブジェクトを返す
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

// DB接続プールをキャッシュする変数
let dbPool;

// プールを返す関数（接続が初期化されていない場合は初期化を待つ）
const getDBPool = async () => {
    if (!dbPool) {
        dbPool = await initializeDB(); // 初回接続時にプールを初期化
    }
    return dbPool;
};

// クエリを実行する関数
const query = async (sql, params = []) => {
    const pool = await getDBPool(); // DB接続プールを取得
    const [rows, fields] = await pool.query(sql, params); // クエリを実行
    return rows; // 結果を返す
};

// `query`関数をエクスポート
module.exports = { query };
