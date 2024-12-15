const {
    checkConflicts,
    create,
    getAll,
    getTemporaryInRange,
    getRegular,
    getTemporaryByDate
} = require('../models/closedDayModel');
const { generateRegularClosedDays, removeDuplicates } = require('../utils/utils');

// 休業日を作成
exports.createClosedDay = async (req, res) => {
    try {
        const payload = req.body;

        // 必須フィールドチェック
        if (!payload.type) {
            return res.status(400).json({ error: 'Type is required' });
        }

        // 競合チェック済みか確認
        if (!payload.conflictResolved) {
            return res.status(400).json({
                error: 'Conflict check not completed. Please resolve conflicts before creating a closed day.',
            });
        }

        // 休業日を作成
        const insertId = await create(payload);

        res.status(201).json({
            message: 'Closed day created successfully',
            id: insertId,
        });
    } catch (error) {
        console.error('Failed to create closed day:', error);
        res.status(500).json({ error: 'Failed to create closed day' });
    }
};

// 競合チェック
exports.checkConflicts = async (req, res) => {
    try {
        const payload = req.body;

        // 必須フィールドチェック
        if (!payload.type) {
            return res.status(400).json({ error: 'Type is required for conflict check' });
        }

        // 競合をチェック
        const conflicts = await checkConflicts(payload);

        // オブジェクトが空でないかチェック
        if (Object.keys(conflicts).length > 0) {
            return res.status(200).json({
                message: 'Conflicts found',
                conflicts: conflicts,
            });
        }

        // 競合がない場合
        res.status(200).json({
            message: 'No conflicts found',
            conflicts: [],
        });
    } catch (error) {
        console.error('Failed to check conflicts:', error);
        return res.status(500).json({ error: 'Failed to check conflicts' });
    }
};

// 休業日を作成
exports.createClosedDay = async (req, res) => {
    try {
        const payload = req.body;

        // 必須フィールドチェック
        if (!payload.type) {
            return res.status(400).json({ error: 'Type is required' });
        }

        // 競合チェック済みか確認
        if (!payload.conflictResolved) {
            return res.status(400).json({
                error: 'Conflict check not completed. Please resolve conflicts before creating a closed day.',
            });
        }

        // 休業日を作成
        const insertId = await create(payload);

        res.status(201).json({
            message: 'Closed day created successfully',
            id: insertId,
        });
    } catch (error) {
        console.error('Failed to create closed day:', error);
        res.status(500).json({ error: 'Failed to create closed day' });
    }
};

// すべての休業日を取得
exports.getAllClosedDays = async (req, res) => {
    try {
        const closedDays = await getAll();
        res.status(200).json(closedDays);
    } catch (error) {
        console.error('Failed to retrieve closed days:', error);
        res.status(500).json({ error: 'Failed to retrieve closed days' });
    }
};

// 指定期間の休業日を取得
exports.getClosedDaysInRange = async (req, res) => {
    const { start_date, end_date } = req.query;

    try {
        if (!start_date || !end_date) {
            return res.status(400).json({ error: 'start_date and end_date are required' });
        }

        // 1. 臨時休業日を取得
        const temporaryClosedDays = await getTemporaryInRange(start_date, end_date);

        // 2. 定休日を取得し、期間内に生成
        const regularClosedDays = await getRegular();
        const generatedClosedDays = generateRegularClosedDays(regularClosedDays, start_date, end_date);

        // 3. 全ての休業日を結合
        const allClosedDays = [...temporaryClosedDays, ...generatedClosedDays];

        // 4. 重複削除
        const uniqueClosedDays = removeDuplicates(allClosedDays);

        res.status(200).json(uniqueClosedDays);
    } catch (error) {
        console.error('Failed to retrieve closed days in range:', error);
        res.status(500).json({ error: 'Failed to retrieve closed days in range' });
    }
};

// 特定の日付が休業日か判定
exports.checkClosedDay = async (req, res) => {
    const { date } = req.query;

    try {
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        const temporaryClosedDay = await getTemporaryByDate(date);
        if (temporaryClosedDay) {
            return res.status(200).json({ is_closed: true, type: 'temporary' });
        }

        const regularClosedDays = await getRegular();
        const generatedClosedDays = generateRegularClosedDays(regularClosedDays, date, date);

        if (generatedClosedDays.length > 0) {
            return res.status(200).json({ is_closed: true, type: 'regular' });
        }

        res.status(200).json({ is_closed: false });
    } catch (error) {
        console.error('Failed to check closed day:', error);
        res.status(500).json({ error: 'Failed to check closed day' });
    }
};