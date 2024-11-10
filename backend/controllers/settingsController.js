// src/controllers/settingsController.js
const settingsModel = require('../models/settingsModel');

exports.getSettings = async (req, res) => {
    try {
        const settings = await settingsModel.getSettings();
        res.status(200).json(settings || {});
    } catch (error) {
        console.error("設定情報の取得に失敗しました:", error);
        res.status(500).json({ message: "設定情報の取得に失敗しました" });
    }
};

// src/controllers/settingsController.js
exports.saveSettings = async (req, res) => {
    console.log('Request body:', req.body); // リクエストボディの内容を確認
    try {
        const { storeName, phoneNumber, address, startValue, startUnit, endValue, endUnit } = req.body;

        const settingsData = {
            storeName,
            phoneNumber,
            address,
            reservationSettings: {
                start: { value: startValue, unit: startUnit },
                end: { value: endValue, unit: endUnit },
            }
        };

        await settingsModel.saveSettings(settingsData);
        res.status(200).json({ message: "設定情報が保存されました" });
    } catch (error) {
        console.error("設定情報の保存に失敗しました:", error);
        res.status(500).json({ message: "設定情報の保存に失敗しました" });
    }
};
