const availabilityModel = require('../models/AvailabilityModel');
const { utcToJstDate } = require('../utils/utils');

exports.getMonthlyAvailability = async (req, res) => {
    try {
        const { year, month, available_since, available_since_time, available_until } = req.query;

        // バリデーション
        if (!year || !month || !available_since || !available_until) {
            return res.status(400).json({ message: "年、月、開始日、終了日は必須です" });
        }

        // Model呼び出しにavailable_since_timeを追加
        const availabilityData = await availabilityModel.getMonthlyAvailability(
            year,
            month,
            available_since,
            available_since_time || null, // 指定がなければnullを渡す
            available_until
        );

        const dailyAvailability = {};

        // スロットデータを日付単位にまとめる
        availabilityData.forEach((slot) => {
            const date = utcToJstDate(slot.date);
            if (!dailyAvailability[date]) {
                dailyAvailability[date] = {
                    date,
                    availability: "1", // 初期値は予約不可
                    slots: [] // スロットリスト
                };
            }
            // スロットを追加
            dailyAvailability[date].slots.push({
                id: slot.id,
                pattern_id: slot.pattern_id,
                start_time: slot.start_time,
                end_time: slot.end_time,
                availability: slot.availability
            });

            // 日付の空き状況を更新
            if (slot.availability === "0") {
                dailyAvailability[date].availability = "0"; // 少なくとも1つ空きがある
            }
        });

        res.status(200).json(Object.values(dailyAvailability));
    } catch (error) {
        console.error("月単位の空き状況取得に失敗しました:", error);
        res.status(500).json({ message: "月単位の空き状況取得に失敗しました" });
    }
};

exports.getDailyAvailability = async (req, res) => {
    try {
        const { date, available_since, available_since_time, available_until } = req.query;

        // 入力バリデーション
        if (!date || !available_since || !available_until) {
            return res.status(400).json({ message: "日付、開始日、終了日は必須です" });
        }

        // モデルにデータを渡してアベイラビリティを取得
        const availabilityData = await availabilityModel.getDailyAvailability(
            date,
            available_since,
            available_since_time || null, // 指定されていない場合は null
            available_until
        );

        res.status(200).json(availabilityData);
    } catch (error) {
        console.error("日単位のアベイラビリティ取得に失敗しました:", error);
        res.status(500).json({ message: "アベイラビリティ取得に失敗しました" });
    }
};

// 現在の予約人数を取得
exports.getCurrentReservationCount = async (req, res) => {
    const { slotId } = req.query;

    if (!slotId) {
        return res.status(400).json({ message: "Slot IDが必要です" });
    }

    try {
        const count = await availabilityModel.getCurrentReservationCount(slotId);
        res.status(200).json({ count });
    } catch (error) {
        console.error("現在の予約人数の取得に失敗しました:", error);
        res.status(500).json({ message: "現在の予約人数の取得に失敗しました", error });
    }
};