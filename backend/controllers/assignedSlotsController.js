const assignedSlotsModel = require('../models/assignedSlotsModel');
const reservationModel = require('../models/reservationModel');
const { utcToJstDate } = require('../utils/utils');

const commentsController = require('./commentsController');

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

        let alertMessage = `スロットのステータスが更新されました (${result.affectedRows} 件)`;

        // スロットが Close に設定された場合
        if (status === 'close') {
            const { affectedRows, reservationIds } = await reservationModel.markReservationsForClosedSlot(slotIds);
            console.log(`${affectedRows} 件の予約の ActionRequired が更新されました`);

            // コメント追加処理
            for (const reservationId of reservationIds) {
                const commentRequest = {
                    body: {
                        reservation_id: reservationId,
                        comment: '予約枠がクローズされました。',
                        isSystem: true,
                    },
                    user: null,
                };

                await commentsController.createComment(commentRequest, {
                    status: () => ({
                        json: () => null,
                    }),
                });
            }

            // 要注意予約がある場合のメッセージ追加
            if (reservationIds.length > 0) {
                alertMessage += ` Closeした予約枠に、すでに${reservationIds.length} 件の予約があります。詳細は要対応予約より確認してください`;
            }
        }

        res.status(200).json({
            message: alertMessage,
        });
    } catch (error) {
        console.error('スロットステータスの更新エラー:', error);
        res.status(500).json({ message: 'スロットステータスの更新に失敗しました', error });
    }
};


exports.getSlotIdsByPattern = async (patternId) => {
    try {
        // モデル経由でスロットIDを取得
        const slotIds = await assignedSlotsModel.getSlotIdsByPattern(patternId);
        return slotIds;
    } catch (error) {
        console.error('パターンに紐づくスロットIDの取得エラー:', error);
        throw new Error('スロットIDの取得に失敗しました');
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
