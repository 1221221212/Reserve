import React, { useState } from 'react';
import AdminCalendar from '../components/AdminCalendar';
import AdminSlotSelection from '../components/AdminSlotSelection';
import AdminReservationList from '../components/AdminReservationList';

const AdminCalendarPage = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedSlot(null); // 日付が変わった場合、スロット選択をリセット
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
    };

    return (
        <div className="admin-calendar-page">
            <section className="calendar-section">
                <p>カレンダー</p>
                <AdminCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
            </section>

            <section className="slot-selection-section">
                <p>予約枠</p>
                {selectedDate ? (
                    <AdminSlotSelection 
                        selectedDate={selectedDate} 
                        onSlotSelect={handleSlotSelect} 
                        selectedSlot={selectedSlot}
                    />
                ) : (
                    <p>日付を選択してください</p>
                )}
            </section>

            <section className="reservation-list-section">
                <p>予約一覧</p>
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
