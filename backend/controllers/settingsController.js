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


exports.saveSettings = async (req, res) => {
    try {
        const { infoSettings, reservationSettings } = req.body;

        // 保存するデータを作成
        await settingsModel.saveSettings(infoSettings, reservationSettings);

        res.status(200).json({ message: "設定情報が保存されました" });
    } catch (error) {
        console.error("設定情報の保存に失敗しました:", error);
        res.status(500).json({ message: "設定情報の保存に失敗しました" });
    }
};

exports.getPublicSettings = async (req, res) => {
    try {
        // 設定情報を取得
        const settings = await settingsModel.getSettings();
        if (!settings) {
            return res.status(404).json({ message: "設定情報が見つかりません" });
        }

        // 必要な情報のみ公開
        const publicSettings = {
            reservationSettings: settings.reservationSettings, // 予約関連設定を公開
        };

        res.status(200).json(publicSettings);
    } catch (error) {
        console.error("公開設定情報の取得に失敗しました:", error);
        res.status(500).json({ message: "公開設定情報の取得に失敗しました", error });
    }
};