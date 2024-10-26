import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { username, password });
            setToken(response.data.token);
        } catch (error) {
            alert('ログインに失敗しました。');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="text" placeholder="ユーザー名" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">ログイン</button>
        </form>
    );
};

export default Login;
