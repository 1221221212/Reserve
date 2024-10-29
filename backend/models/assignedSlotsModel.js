const db = require('./db'); // db.jsファイルが必要です

exports.getAllAssignedSlots = () => {
    return db.promise().query('SELECT * FROM assigned_slots');
};

exports.createAssignedSlot = (slotData) => {
    const { date, patternId } = slotData;
    return db.promise().query(
        'INSERT INTO assigned_slots (date, pattern_id) VALUES (?, ?)',
        [date, patternId]
    );
};
