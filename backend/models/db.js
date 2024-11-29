const mysql = require('mysql2/promise');
const tunnel = require('tunnel-ssh');

const sshConfig = {
    username: process.env.SSH_USER,
    privateKey: process.env.SSH_PRIVATE_KEY.replace(/\\n/g, '\n'),
    host: 'iw33.xsrv.jp',
    port: 10022,
    dstHost: '127.0.0.1',
    dstPort: 3306,
};

const db = async () => {
    try {
        // SSHトンネルを確立
        const server = await new Promise((resolve, reject) => {
            tunnel(sshConfig, (error, server) => {
                if (error) {
                    console.error("SSHトンネルエラー:", error);
                    return reject(error);
                }
                console.log("SSHトンネルが正常に開かれました");
                resolve(server);
            });
        });

        // MySQL接続
        const connection = await mysql.createPool({
            host: '127.0.0.1',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: 3306,
        });

        console.log("データベース接続に成功しました");
        return connection;
    } catch (error) {
        console.error("接続エラー:", error);
        throw error;
    }
};

module.exports = db;
