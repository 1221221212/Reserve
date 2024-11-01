const assignedSlotsModel = require('../models/assignedSlotsModel');

exports.getAssignedSlots = async (req, res) => {
    try {
        const slots = await assignedSlotsModel.getAllAssignedSlots();
        res.status(200).json(slots);
    } catch (error) {
        console.error('予約枠データの取得エラー:', error);
        res.status(500).json({ message: '予約枠データの取得に失敗しました', error });
    }
};

// controllers/assignedSlotsController.js
exports.createAssignedSlot = async (req, res) => {
    const { dates, patterns } = req.body;
    try {
        for (let date of dates) {
            // 日付を YYYY-MM-DD 形式に変換
            const formattedDate = new Date(date).toISOString().split('T')[0];
            for (let pattern of patterns) {
                await assignedSlotsModel.createAssignedSlot({
                    date: formattedDate,
                    patternId: pattern.id
                });
            }
        }
        res.status(201).json({ message: '予約枠が作成されました' });
    } catch (error) {
        console.error('予約枠の作成エラー:', error);
        res.status(500).json({ message: '予約枠の作成に失敗しました', error });
    }
};
