const mysql = require('mysql2/promise');
<<<<<<< HEAD
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
=======
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
        connectTimeout: 10000, // タイムアウトを10秒に設定
    });
};

// DB接続を初期化する関数
const initializeDB = () => {
    return new Promise((resolve, reject) => {
        sshClient.on('ready', () => {
            console.log('SSH接続に成功しました');
            sshClient.forwardOut(
                '127.0.0.1',  // ローカルホスト
                3307,          // ローカルポート
                DB_HOST,       // リモートホスト（Xserver上のMySQL）
                DB_PORT,       // リモートポート
                (err, stream) => {
                    if (err) {
                        console.error('SSHトンネルの作成に失敗しました:', err);
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

        sshClient.on('error', (err) => {
            console.error('SSH接続エラー:', err);
            reject(err);
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
    try {
        const pool = await getDBPool(); // DB接続プールを取得
        const [rows, fields] = await pool.query(sql, params); // クエリを実行
        return rows; // 結果を返す
    } catch (error) {
        console.error('クエリ実行中にエラーが発生しました:', error);
        throw error;
    }
};

// `query`関数をエクスポート
module.exports = { query };
>>>>>>> dd656250cfad71a318be03c7240d73bca59dd641
