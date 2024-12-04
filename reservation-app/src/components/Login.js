// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/Login.scss"

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // エラーメッセージのリセット
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { username, password });
            const token = response.data.token;

            // トークンをローカルストレージに保存して状態を更新
            localStorage.setItem('token', token);
            setToken(token);

            // 管理画面にリダイレクト
            navigate('/admin');
        } catch (error) {
            setError('ログインに失敗しました。');
            console.error("ログインエラー:", error);
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
