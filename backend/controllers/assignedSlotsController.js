const assignedSlotsModel = require('../models/assignedSlotsModel');
const { utcToJstDate } = require('../utils/dateUtils');

// 予約枠の取得
exports.getAssignedSlots = async (req, res) => {
    try {
        const slots = await assignedSlotsModel.getAllAssignedSlots();

        // 各スロットの日付をJSTに変換してレスポンス
        const jstSlots = slots.map(slot => ({
            ...slot,
            date: utcToJstDate(slot.date) // 日付をJSTに変換
        }));

        res.status(200).json(jstSlots);
    } catch (error) {
        console.error('予約枠データの取得エラー:', error);
        res.status(500).json({ message: '予約枠データの取得に失敗しました', error });
    }
};


// 予約枠の作成
exports.createAssignedSlot = async (req, res) => {
    const { dates, patterns } = req.body;
    try {
        for (let date of dates) {
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
