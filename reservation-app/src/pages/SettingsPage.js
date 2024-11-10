// src/pages/SettingsPage.js
import React, { useState, useEffect } from 'react';
import "../styles/SettingsPage.scss";

const SettingsPage = () => {
    const [storeName, setStoreName] = useState('');
    const [storeLogo, setStoreLogo] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [startValue, setStartValue] = useState('');
    const [startUnit, setStartUnit] = useState('日');
    const [endValue, setEndValue] = useState('');
    const [endUnit, setEndUnit] = useState('日');

    // 設定情報をサーバーから取得し、フィールドにセット
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/settings', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStoreName(data.storeName || '');
                    setPhoneNumber(data.phoneNumber || '');
                    setAddress(data.address || '');
                    setStartValue(data.reservationSettings.start.value || '');
                    setStartUnit(data.reservationSettings.start.unit || '日');
                    setEndValue(data.reservationSettings.end.value || '');
                    setEndUnit(data.reservationSettings.end.unit || '日');
                } else {
                    console.error("設定情報の取得に失敗しました");
                }
            } catch (error) {
                console.error("設定情報の取得に失敗しました:", error);
            }
        };

        fetchSettings();
    }, []);

    const handleLogoChange = (event) => {
        setStoreLogo(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const settingsData = {
            storeName,
            phoneNumber,
            address,
            startValue,
            startUnit,
            endValue,
            endUnit,
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(settingsData),
            });
            const result = await response.json();
            if (response.ok) {
                console.log(result.message);
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error("設定情報の保存に失敗しました:", error);
        }
    };

    return (
        <div className="settings-page">
            <h1>設定画面</h1>
            <form onSubmit={handleSubmit}>
                {/* 基本情報セクション */}
                <section className="basic-info-section">
                    <h2>基本情報</h2>
                    <div className="form-row">
                        <label>店舗名:</label>
                        <input
                            type="text"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                        />
                    </div>
                    <div className="form-row">
                        <label>店舗ロゴ:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                        />
                    </div>
                    <div className="form-row">
                        <label>電話番号:</label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className="form-row">
                        <label>住所:</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        ></textarea>
                    </div>
                </section>

                {/* 予約設定セクション */}
                <section className="reservation-settings-section">
                    <h2>予約設定</h2>
                    <div className="form-row">
                        <label>受付開始:</label>
                        <input
                            type="number"
                            value={startValue}
                            onChange={(e) => setStartValue(e.target.value)}
                            placeholder="数値を入力"
                        />
                        <select
                            value={startUnit}
                            onChange={(e) => setStartUnit(e.target.value)}
                        >
                            <option value="日">日</option>
                            <option value="週">週</option>
                            <option value="月">月</option>
                            <option value="年">年</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <label>受付終了:</label>
                        <input
                            type="number"
                            value={endValue}
                            onChange={(e) => setEndValue(e.target.value)}
                            placeholder="数値を入力"
                        />
                        <select
                            value={endUnit}
                            onChange={(e) => setEndUnit(e.target.value)}
                        >
                            <option value="日">日</option>
                            <option value="週">週</option>
                            <option value="月">月</option>
                            <option value="年">年</option>
                        </select>
                    </div>
                </section>

                <button type="submit">保存</button>
            </form>
        </div>
    );
};

export default SettingsPage;
