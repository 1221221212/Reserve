// src/components/ReservationForm.js

import React, { useState } from 'react';

const ReservationForm = ({ onSubmit, maxPeoplePerGroup }) => {
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [numPeople, setNumPeople] = useState(1);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (numPeople > maxPeoplePerGroup) {
            setError(`人数は最大 ${maxPeoplePerGroup} 人までです`);
            return;
        }
        setError('');
        onSubmit({
            customer_name: customerName,
            phone_number: phoneNumber,
            email: email,
            group_size: numPeople,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>名前:</label>
                <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>電話番号:</label>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>メールアドレス:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>人数:</label>
                <input
                    type="number"
                    value={numPeople}
                    onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        setNumPeople(value);
                        if (value > maxPeoplePerGroup) {
                            setError(`人数は最大 ${maxPeoplePerGroup} 人までです`);
                        } else {
                            setError('');
                        }
                    }}
                    min="1"
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <button type="submit">予約を確認</button>
        </form>
    );
};

export default ReservationForm;
