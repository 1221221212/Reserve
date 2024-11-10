// src/components/ReservationForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReservationForm = ({ onSubmit, max_people, max_groups, slotId }) => {
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [numPeople, setNumPeople] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentCount, setCurrentCount] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [validationErrors, setValidationErrors] = useState({
        customerName: '',
        phoneNumber: '',
        email: '',
        numPeople: '',
    });

    useEffect(() => {
        const fetchCurrentReservationCount = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/availability/current-reservation-count`, {
                    params: { slotId },
                });
                setCurrentCount(response.data.count);
            } catch (error) {
                console.error("現在の予約人数の取得に失敗しました:", error);
            }
        };

        fetchCurrentReservationCount();
    }, [slotId]);

    useEffect(() => {
        // ボタンの有効化チェック
        const hasErrors = Object.values(validationErrors).some(error => error !== '') || !customerName || !phoneNumber || !email;
        setIsButtonDisabled(hasErrors);
    }, [validationErrors, customerName, phoneNumber, email]);

    const validateField = (field, value) => {
        let error = '';

        switch (field) {
            case 'customerName':
                if (!value) error = '名前を入力してください';
                break;
            case 'phoneNumber':
                if (!/^\d{10,15}$/.test(value)) error = '有効な電話番号を入力してください';
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = '有効なメールアドレスを入力してください';
                break;
                case 'numPeople':
                    if (max_groups) {
                        // 最大組数が設定されている場合は、1組あたりの最大人数のチェックのみ
                        if (value > max_people) error = `人数が多すぎます。最大${max_people}人までです。`;
                    } else {
                        // 最大組数が設定されていない場合は、残りの人数で判定
                        if (max_people && (max_people - currentCount) < value) {
                            error = `残りの人数が不足しています。予約可能な人数は最大${max_people - currentCount}人です。`;
                        }
                    }
                    break;
            default:
                break;
        }

        setValidationErrors(prevErrors => ({
            ...prevErrors,
            [field]: error,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isButtonDisabled) {
            setErrorMessage('');
            onSubmit({
                customer_name: customerName,
                phone_number: phoneNumber,
                email: email,
                group_size: numPeople,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="reservation-form">
            <div className="form-group">
                <label>名前:</label>
                <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    onBlur={() => validateField('customerName', customerName)}
                    required
                />
                {validationErrors.customerName && <p className="error-message">{validationErrors.customerName}</p>}
            </div>
            <div className="form-group">
                <label>電話番号:</label>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    onBlur={() => validateField('phoneNumber', phoneNumber)}
                    required
                />
                {validationErrors.phoneNumber && <p className="error-message">{validationErrors.phoneNumber}</p>}
            </div>
            <div className="form-group">
                <label>メールアドレス:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validateField('email', email)}
                    required
                />
                {validationErrors.email && <p className="error-message">{validationErrors.email}</p>}
            </div>
            <div className="form-group">
                <label>人数:</label>
                <input
                    type="number"
                    value={numPeople}
                    onChange={(e) => setNumPeople(parseInt(e.target.value, 10))}
                    onBlur={() => validateField('numPeople', numPeople)}
                    min="1"
                    required
                />
                {validationErrors.numPeople && <p className="error-message">{validationErrors.numPeople}</p>}
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit" disabled={isButtonDisabled}>予約を確認</button>
        </form>
    );
};

export default ReservationForm;
