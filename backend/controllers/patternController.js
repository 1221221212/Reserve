// src/controllers/patternController.js
const patternModel = require('../models/patternModel');
const assignedSlotsController = require('./assignedSlotsController');

// 予約パターンの保存
exports.createPattern = async (req, res) => {
    const { pattern_name, start_time, end_time, max_groups, max_people } = req.body;

    try {
        // 重複チェック
        const isDuplicate = await patternModel.isPatternDuplicate({ start_time, end_time, max_groups, max_people });
        if (isDuplicate) {
            return res.status(400).json({ message: '同じパターンが既に存在します' });
        }

        // 新しいパターンを作成
        const newPattern = await patternModel.createPattern({
            pattern_name,
            start_time,
            end_time,
            max_groups,
            max_people,
        });
        res.status(201).json({ message: 'パターンが保存されました', pattern: newPattern });
    } catch (error) {
        res.status(500).json({ message: 'パターンの保存に失敗しました', error });
    }
};


// 予約パターンの取得
exports.getPatterns = async (req, res) => {
    try {
        const patterns = await patternModel.getPatterns(); // 保存されたパターンを取得
        res.status(200).json(patterns);
    } catch (error) {
        res.status(500).json({ message: 'パターンの取得に失敗しました', error });
    }
};

// パターンの停止
exports.closePattern = async (req, res) => {
    const { id } = req.params;

    try {
        // パターンのステータスを「close」に更新
        const result = await patternModel.updatePatternStatus(id, 'close');
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'パターンが見つかりません' });
        }

        // スロットIDを取得
        const slotIds = await assignedSlotsController.getSlotIdsByPattern(id);

        if (slotIds.length === 0) {
            return res.status(404).json({ message: '関連するスロットが見つかりません' });
        }

        // ステータスを "close" に更新
        const assignedSlotsResponse = await assignedSlotsController.updateAssignedSlotsStatus({
            body: { slotIds, status: 'close' },
        }, {
            status: (code) => ({
                json: (response) => {
                    if (code !== 200) {
                        throw new Error(response.message || 'Assigned slots update failed');
                    }
                },
            }),
        });

        res.status(200).json({
            message: 'パターンおよび関連するスロットが受付停止になりました',
            assignedSlotsResponse,
        });
    } catch (error) {
        console.error('パターンまたはスロットの受付停止に失敗しました:', error);
        res.status(500).json({ message: '更新に失敗しました', error: error.message });
    }
};
