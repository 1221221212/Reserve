import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReservationForm = ({ slotId, formValues, onSubmit, max_people, max_groups }) => {
    const [currentCount, setCurrentCount] = useState(0); // 現在の予約人数
    const [errorMessage, setErrorMessage] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true); // ボタンの有効化状態
    const [validationErrors, setValidationErrors] = useState({
        customer_name: '',
        phone_number: '',
        email: '',
        group_size: '',
    });

    useEffect(() => {
        if (!formValues.group_size) {
            formValues.group_size = 1; // 初期値を明示的に設定
        }
    }, []);

    // 現在の予約人数を取得する
    useEffect(() => {
        const fetchCurrentReservationCount = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/availability/current-reservation-count`, {
                    params: { slotId },
                });
                setCurrentCount(response.data.count.current_people); // 現在の予約人数を設定
            } catch (error) {
                console.error("現在の予約人数の取得に失敗しました:", error);
            }
        };

        if (slotId) {
            fetchCurrentReservationCount(); // slotIdが設定された場合に取得
        }
    }, [slotId]);

    // ボタンの有効化チェック
    useEffect(() => {
        const hasErrors =
            Object.values(validationErrors).some((error) => error !== '') ||
            !formValues.customer_name ||
            !formValues.phone_number ||
            !formValues.email ||
            formValues.group_size <= 0;
        setIsButtonDisabled(hasErrors);
    }, [validationErrors, formValues]);

    // 各フィールドのバリデーション
    const validateField = (field, value) => {
        let error = '';

        switch (field) {
            case 'customer_name':
                if (!value.trim()) error = '名前を入力してください。';
                break;
            case 'phone_number':
                if (!/^\d{10,15}$/.test(value)) error = '有効な電話番号を入力してください。';
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = '有効なメールアドレスを入力してください。';
                break;
            case 'group_size':
                if (value <= 0) {
                    error = '人数は1以上である必要があります。';
                } else if (max_groups) {
                    // 最大組数が設定されている場合
                    if (value > max_people) error = `人数が多すぎます。最大${max_people}人までです。`;
                } else if (max_people && value > max_people - currentCount) {
                    // 最大人数が設定されている場合
                    error = `残りの人数が不足しています。予約可能な人数は最大${max_people - currentCount}人です。`;
                }
                break;
            default:
                break;
        }

        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error,
        }));
    };

    const handleChange = (field, value) => {
        formValues[field] = value; // 状態を直接更新
        validateField(field, value); // バリデーション実行
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isButtonDisabled) {
            setErrorMessage(''); // エラーをクリア
            onSubmit({...formValues}); // 親コンポーネントにデータを送信
        }
    };

    return (
        <form onSubmit={handleSubmit} className="reservation-form">
            <div className="form-group">
                <label>名前:</label>
                <input
                    type="text"
                    value={formValues.customer_name || ''}
                    onChange={(e) => handleChange('customer_name', e.target.value)}
                    onBlur={() => validateField('customer_name', formValues.customer_name)}
                    required
                />
                {validationErrors.customer_name && <p className="error-message">{validationErrors.customer_name}</p>}
            </div>
            <div className="form-group">
                <label>電話番号:</label>
                <input
                    type="tel"
                    value={formValues.phone_number || ''}
                    onChange={(e) => handleChange('phone_number', e.target.value)}
                    onBlur={() => validateField('phone_number', formValues.phone_number)}
                    required
                />
                {validationErrors.phone_number && <p className="error-message">{validationErrors.phone_number}</p>}
            </div>
            <div className="form-group">
                <label>メールアドレス:</label>
                <input
                    type="email"
                    value={formValues.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => validateField('email', formValues.email)}
                    required
                />
                {validationErrors.email && <p className="error-message">{validationErrors.email}</p>}
            </div>
            <div className="form-group">
                <label>人数:</label>
                <input
                    type="number"
                    value={formValues.group_size || 1}
                    onChange={(e) => handleChange('group_size', parseInt(e.target.value, 10))}
                    onBlur={() => validateField('group_size', formValues.group_size)}
                    min="1"
                    required
                />
                {validationErrors.group_size && <p className="error-message">{validationErrors.group_size}</p>}
            </div>
            <div className="form-group">
                <label>コメント:</label>
                <textarea
                    value={formValues.comment || ''}
                    onChange={(e) => handleChange('comment', e.target.value)}
                />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <p>現在の予約人数: {currentCount}</p>
            <button type="submit" disabled={isButtonDisabled}>
                予約を確認
            </button>
        </form>
    );
};

export default ReservationForm;
