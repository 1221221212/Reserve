const { utc } = require('moment-timezone');
const availabilityModel = require('../models/availabilityModel');
const { utcToJstDate } = require('../utils/dateUtils');

// 月単位の空き状況を取得
exports.getMonthlyAvailability = async (req, res) => {
    try {
        const { year, month } = req.query;

        if (!year || !month) {
            return res.status(400).json({ message: "年と月が必要です" });
        }

        const availabilityData = await availabilityModel.getMonthlyAvailability(year, month);
        const dailyAvailability = {};

        availabilityData.forEach((slot) => {
            // 取得したUTCの日付をJSTに変換
            const date = utcToJstDate(slot.date);
            if (!dailyAvailability[date]) {
                dailyAvailability[date] = { date, availability: '1' }; // 初期は「✕」
            }
            if (slot.availability === '0') { // availability が '0' の場合は「〇」
                dailyAvailability[date].availability = '0';
            }
        });

        console.log(dailyAvailability);
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
        const availability = await availabilityModel.getDailyAvailability(date);
        const jstAvailability = availability.map(slot => ({
            ...slot,
            date: utcToJstDate(slot.date) // JSTに変換して日付を格納
        }));
        
        res.status(200).json(jstAvailability);
    } catch (error) {
        console.error('日単位の空き状況取得に失敗しました:', error);
        res.status(500).json({ message: '日単位の空き状況取得に失敗しました', error });
    }
};
