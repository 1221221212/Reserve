// models/User.js
const db = require('./db');

class User {
    static async create({ username, password_hash, email, role }) {
        const [result] = await db.query(
            'INSERT INTO users (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
            [username, password_hash, email, role || 'user']
        );
        return result;
    }

    static async findByUsername(username) {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    }
}

module.exports = User;
