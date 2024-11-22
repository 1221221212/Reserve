import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "../styles/SettingsPage.scss";
import InfoSettings from '../components/InfoSettings';
import ReservationSettings from '../components/ReservationSettings';

const SettingsPage = () => {
    const location = useLocation();
    const [storeName, setStoreName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [startMethod, setStartMethod] = useState('interval');
    const [startValue, setStartValue] = useState('');
    const [startUnit, setStartUnit] = useState('day');
    const [releaseIntervalUnit, setReleaseIntervalUnit] = useState('week');
    const [weekReleaseTiming, setWeekReleaseTiming] = useState({ weeksBefore: 1, day: 'sunday', startingDay: 'sunday' });
    const [monthReleaseTiming, setMonthReleaseTiming] = useState({ monthsBefore: 1, date: 1, });
    const [endValue, setEndValue] = useState('');
    const [endUnit, setEndUnit] = useState('day');
    const [isSameDay, setIsSameDay] = useState(false);
    const [endHours, setEndHours] = useState('');
    const [endMinutes, setEndMinutes] = useState('');

    // 設定情報を取得する関数
    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Authentication token not found");
                return;
            }

            const response = await fetch('/api/settings', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const { infoSettings, reservationSettings } = data;

                // 取得した設定情報をフォームにセット
                setStoreName(infoSettings.storeName);
                setPhoneNumber(infoSettings.phoneNumber);
                setAddress(infoSettings.address);

                if (reservationSettings.start) {
                    setStartMethod(reservationSettings.start.method);
                    if (reservationSettings.start.method === 'interval') {
                        setStartValue(reservationSettings.start.value);
                        setStartUnit(reservationSettings.start.unit);
                    } else if (reservationSettings.start.releaseInterval) {
                        setReleaseIntervalUnit(reservationSettings.start.releaseInterval.unit);
                        setWeekReleaseTiming(reservationSettings.start.releaseInterval.weekReleaseTiming || {});
                        setMonthReleaseTiming(reservationSettings.start.releaseInterval.monthReleaseTiming || {});
                    }
                }

                if (reservationSettings.end) {
                    setIsSameDay(reservationSettings.end.isSameDay);
                    if (reservationSettings.end.isSameDay) {
                        setEndHours(reservationSettings.end.hoursBefore);
                        setEndMinutes(reservationSettings.end.minutesBefore);
                    } else {
                        setEndValue(reservationSettings.end.value);
                        setEndUnit(reservationSettings.end.unit);
                    }
                }
            } else {
                console.error("Failed to fetch settings:", response.status);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    };

    // コンポーネントがマウントされた時に設定情報を取得
    useEffect(() => {
        fetchSettings();
    }, []);

    // 送信処理用の関数を定義
    const handleSubmit = async (e) => {
        e.preventDefault();

        const reservationSettings = {
            start: {
                method: startMethod,
                ...(startMethod === 'interval'
                    ? { value: startValue, unit: startUnit }
                    : { releaseInterval: { unit: releaseIntervalUnit, weekReleaseTiming: releaseIntervalUnit === 'week' ? weekReleaseTiming : undefined, monthReleaseTiming: releaseIntervalUnit === 'month' ? monthReleaseTiming : undefined } }),
            },
            end: isSameDay
                ? { isSameDay, hoursBefore: endHours, minutesBefore: endMinutes }
                : { isSameDay, value: endValue, unit: endUnit },
        };

        const infoSettings = {
            storeName,
            phoneNumber,
            address,
        };

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Authentication token not found");
                return;
            }

            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    infoSettings,  // InfoSettings を送信
                    reservationSettings,  // ReservationSettings を送信
                }),
            });

            if (response.ok) {
                console.log("Settings saved successfully");
            } else {
                console.error("Failed to save settings:", response.status);
            }
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    };

    return (
        <div className="settings-page">
            <h1>設定画面</h1>
            {location.pathname === '/admin/settings/info' && (
                <InfoSettings
                    storeName={storeName}
                    phoneNumber={phoneNumber}
                    address={address}
                    setStoreName={setStoreName}
                    setPhoneNumber={setPhoneNumber}
                    setAddress={setAddress}
                />
            )}
            {location.pathname === '/admin/settings/reservation' && (
                <ReservationSettings
                    startMethod={startMethod}
                    setStartMethod={setStartMethod}
                    startValue={startValue}
                    setStartValue={setStartValue}
                    startUnit={startUnit}
                    setStartUnit={setStartUnit}
                    releaseIntervalUnit={releaseIntervalUnit}
                    setReleaseIntervalUnit={setReleaseIntervalUnit}
                    weekReleaseTiming={weekReleaseTiming}
                    setWeekReleaseTiming={setWeekReleaseTiming}
                    monthReleaseTiming={monthReleaseTiming}
                    setMonthReleaseTiming={setMonthReleaseTiming}
                    isSameDay={isSameDay}
                    setIsSameDay={setIsSameDay}
                    endHours={endHours}
                    setEndHours={setEndHours}
                    endMinutes={endMinutes}
                    setEndMinutes={setEndMinutes}
                    endValue={endValue}
                    setEndValue={setEndValue}
                    endUnit={endUnit}
                    setEndUnit={setEndUnit}
                />
            )}
            <button onClick={handleSubmit}>保存</button>
        </div>
    );
};

export default SettingsPage;
