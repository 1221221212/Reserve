import React, { useState } from 'react';

const CloseManagementPage = () => {
    const [closedDates, setClosedDates] = useState([]);

    const addClosedDate = (date) => {
        setClosedDates([...closedDates, date]);
    };

    const removeClosedDate = (index) => {
        const updatedDates = closedDates.filter((_, i) => i !== index);
        setClosedDates(updatedDates);
    };

    return (
        <div className="close-management-page">
            <h1>休業日管理</h1>
            <ul>
                {closedDates.map((date, index) => (
                    <li key={index}>
                        {date}
                        <button onClick={() => removeClosedDate(index)}>削除</button>
                    </li>
                ))}
            </ul>
            <input type="date" onChange={(e) => addClosedDate(e.target.value)} />
        </div>
    );
};

export default CloseManagementPage;
