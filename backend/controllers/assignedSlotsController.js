const assignedSlotsModel = require('../models/assignedSlotsModel');
const { utcToJstDate } = require('../utils/utils');

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

const organizeSlots = (dates, patterns) => {
    const organizedData = {};
    for (const date of dates) {
        organizedData[date] = patterns.map(pattern => pattern.id);
    }
    return organizedData;
};

// 予約枠の作成
exports.createAssignedSlot = async (req, res) => {
    const { dates, patterns } = req.body;

    try {
        // 整形処理
        const organizedSlots = organizeSlots(dates, patterns);
        console.log('整形済みのスロット:', organizedSlots);

        // 重複チェック
        const newSlots = await assignedSlotsModel.checkDuplicates(organizedSlots);

        console.log(newSlots);

        // 新規スロットがあれば挿入処理
        if (newSlots.length > 0) {
            await assignedSlotsModel.createAssignedSlots(newSlots);
            res.status(201).json({
                message: `${newSlots.length}件の予約枠が作成されました`,
            });
        } else {
            res.status(200).json({
                message: '全ての予約枠が既に存在しています',
            });
        }
    } catch (error) {
        console.error('スロット作成エラー:', error);
        res.status(500).json({ message: 'スロット作成に失敗しました', error });
    }
};

// 予約枠のステータスを更新
exports.updateAssignedSlotsStatus = async (req, res) => {
    const { slotIds, status } = req.body;

    // Validation
    if (!slotIds || !Array.isArray(slotIds) || slotIds.length === 0 || !['active', 'suspend', 'close', 'inactive'].includes(status)) {
        return res.status(400).json({ message: '無効なslotIdsまたはstatusです' });
    }

    try {
        const result = await assignedSlotsModel.updateSlotsStatus(slotIds, status);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '指定されたスロットが見つかりません' });
        }

        res.status(200).json({
            message: `スロットのステータスが更新されました (${result.affectedRows} 件)`
        });
    } catch (error) {
        console.error('スロットステータスの更新エラー:', error);
        res.status(500).json({ message: 'スロットステータスの更新に失敗しました', error });
    }
};

exports.getSlotsByMonth = async (req, res) => {
    const { year, month } = req.query;

    if (!year || !month) {
        return res.status(400).json({ message: 'year と month は必須です' });
    }

    try {
        const slots = await assignedSlotsModel.getMonthlySlots(year, month);
        const result = {};

        slots.forEach(slot => {
            const date = slot.date;
            if (!result[date]) {
                result[date] = { date, has_slots: false, slot_count: 0, reservation_count: 0 };
            }
            result[date].has_slots = true;
            result[date].slot_count++;
            result[date].reservation_count += slot.reservation_count;
        });

        res.status(200).json(Object.values(result));
    } catch (error) {
        console.error('月単位の予約枠データ取得エラー:', error);
        res.status(500).json({ message: '月単位の予約枠データ取得に失敗しました', error });
    }
};

exports.getSlotsByDay = async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ error: "date is required" });
    }

    try {
        const slots = await assignedSlotsModel.getDailySlots(date);
        res.status(200).json(slots);
    } catch (error) {
        console.error("Failed to fetch slot details:", error);
        res.status(500).json({ error: "Failed to fetch slot details" });
    }
};
