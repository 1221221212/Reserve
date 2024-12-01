// src/utils/authUtils.js
import axios from 'axios';

// トークンが期限切れかどうか確認
export const isTokenExpired = (token, bufferTime = 0) => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000;
        return Date.now() > (expiry - bufferTime);
    } catch (error) {
        console.error("トークンのデコードに失敗しました:", error);
        return true;
    }
};

// アクセストークンをリフレッシュ
export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/refresh`, { token: refreshToken });
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('token', newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error("トークンのリフレッシュに失敗しました:", error);
        return null;
    }
};
