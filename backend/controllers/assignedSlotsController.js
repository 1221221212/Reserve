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

exports.createAssignedSlot = async (req, res) => {
    try {
        const newSlot = await assignedSlotsModel.createAssignedSlot(req.body);
        res.status(201).json({ message: '予約枠が作成されました', newSlot });
    } catch (error) {
        console.error('予約枠の作成エラー:', error);
        res.status(500).json({ message: '予約枠の作成に失敗しました', error });
    }
};
