import React, { useState } from 'react';
import AdminCalendar from '../components/AdminCalendar';
import AdminSlotSelection from '../components/AdminSlotSelection';
import AdminReservationList from '../components/AdminReservationList';

const AdminCalendarPage = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedSlot(null); // 日付が変更されたらスロット選択をリセット
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot); // スロット選択時に状態を更新
    };

    return (
        <div className="admin-calendar-page">
            <section className="calendar-section">
                <h2>カレンダー</h2>
                <AdminCalendar onDateSelect={handleDateSelect} />
            </section>

            <section className="slot-selection-section">
                <h2>予約枠</h2>
                {selectedDate ? (
                    <AdminSlotSelection 
                        selectedDate={selectedDate} 
                        onSlotSelect={handleSlotSelect} 
                    />
                ) : (
                    <p>日付を選択してください</p>
                )}
            </section>

            <section className="reservation-list-section">
                <h2>予約一覧</h2>
                {selectedDate ? (
                    <AdminReservationList 
                        selectedDate={selectedDate} 
                        selectedSlot={selectedSlot} 
                    />
                ) : (
                    <p>日付を選択してください</p>
                )}
            </section>
        </div>
    );
};

export default AdminCalendarPage;
