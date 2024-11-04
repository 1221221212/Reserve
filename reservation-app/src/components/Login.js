// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.scss';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // リセットエラー
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { username, password });
            const token = response.data.token;
            setToken(token);
            localStorage.setItem('token', token);
        } catch (error) {
            setError('ログインに失敗しました。');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>ログイン</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    placeholder="ユーザー名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">ログイン</button>
            </form>
        </div>
    );
};

export default Login;
