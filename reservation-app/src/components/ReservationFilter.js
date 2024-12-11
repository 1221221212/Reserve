// src/components/ReservationFilter.js
import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import '../styles/ReservationFilter.scss';

const ReservationFilter = ({ onApplyFilter }) => {
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0]);
    const [reservationId, setReservationId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [hasComment, setHasComment] = useState('');

    const toggleFilterVisibility = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    const handleApplyFilter = () => {
        onApplyFilter({ startDate, endDate, reservationId, customerName, phoneNumber, email, status, hasComment });
        toggleFilterVisibility();
    };

    const isOtherFiltersDisabled = reservationId.trim() !== '';

    return (
        <div className="reservation-filter">
            <div onClick={toggleFilterVisibility} className="filter-icon">
                <FaFilter size={20} />
            </div>

            {isFilterVisible && (
                <div className="filter-options">
                    <div className="filter-row">
                        <label>予約日:</label>
                        <div className="date-range">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                disabled={isOtherFiltersDisabled}
                            />
                            <span>〜</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                disabled={isOtherFiltersDisabled}
                            />
                        </div>
                    </div>
                    <div className="filter-row">
                        <label>予約ID:</label>
                        <input
                            type="text"
                            value={reservationId}
                            onChange={(e) => setReservationId(e.target.value)}
                            placeholder="予約IDを入力"
                        />
                    </div>
                    <div className="filter-row">
                        <label>予約者名:</label>
                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="予約者名を入力"
                            disabled={isOtherFiltersDisabled}
                        />
                    </div>
                    <div className="filter-row">
                        <label>電話番号:</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="電話番号を入力"
                            disabled={isOtherFiltersDisabled}
                        />
                    </div>
                    <div className="filter-row">
                        <label>メールアドレス:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="メールアドレスを入力"
                            disabled={isOtherFiltersDisabled}
                        />
                    </div>
                    <div className="filter-row">
                        <label>ステータス:</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            disabled={isOtherFiltersDisabled}
                        >
                            <option value="">全て</option>
                            <option value="confirmed">確定</option>
                            <option value="pending">保留</option>
                            <option value="canceled">キャンセル</option>
                        </select>
                    </div>
                    <div className="filter-row">
                        <label>コメントの有無:</label>
                        <select
                            value={hasComment}
                            onChange={(e) => setHasComment(e.target.value)}
                            disabled={isOtherFiltersDisabled}
                        >
                            <option value="">全て</option>
                            <option value="true">あり</option>
                            <option value="false">なし</option>
                        </select>
                    </div>
                    <div className="filter-apply">
                        <button onClick={handleApplyFilter} className="apply-filter-button">
                            フィルターを適用
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationFilter;
