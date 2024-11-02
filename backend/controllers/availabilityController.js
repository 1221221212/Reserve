const availabilityModel = require('../models/availabilityModel');

// 月単位の空き状況を取得
exports.getMonthlyAvailability = async (req, res) => {
    try {
        const { year, month } = req.query;

        if (!year || !month) {
            return res.status(400).json({ message: "年と月が必要です" });
        }

        // データ取得
        const availabilityData = await availabilityModel.getMonthlyAvailability(year, month);
        const dailyAvailability = {};

        availabilityData.forEach((slot) => {
            const date = slot.date.toISOString().split('T')[0];
            if (!dailyAvailability[date]) {
                dailyAvailability[date] = { date, availability: '1' }; // 初期は「✕」
            }
            if (slot.availability === '0') { // availability が '0' の場合は「〇」
                dailyAvailability[date].availability = '0';
            }
        });

        // 日毎の空き状況をレスポンスに返す
        res.status(200).json(Object.values(dailyAvailability));
    } catch (error) {
        console.error('月単位の空き状況取得に失敗しました:', error);
        res.status(500).json({ message: '月単位の空き状況取得に失敗しました', error });
    }
};

// 日単位の空き状況を取得
exports.getDailyAvailability = async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: "日付が必要です" });
    }

    try {
        // 日単位のスロットを取得（時間も含める）
        const availability = await availabilityModel.getDailyAvailability(date);
        res.status(200).json(availability);
    } catch (error) {
        console.error('日単位の空き状況取得に失敗しました:', error);
        res.status(500).json({ message: '日単位の空き状況取得に失敗しました', error });
    }
};
