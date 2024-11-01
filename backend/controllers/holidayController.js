// backend/controllers/holidayController.js
const axios = require('axios');

exports.getHolidays = async (req, res) => {
    try {
        const { startDate, endDate } = req.query; // クエリからstartDateとendDateを取得
        const apiKey = process.env.GOOGLE_API_KEY; // Google APIキーを環境変数から取得
        const calendarId = 'ja.japanese.official%23holiday@group.v.calendar.google.com'; // 公式の祝日カレンダーID

        const response = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
            params: {
                key: apiKey,
                timeMin: `${startDate}T00:00:00Z`, // ユーザーが選択した開始日
                timeMax: `${endDate}T23:59:59Z`, // ユーザーが選択した終了日
                singleEvents: true,
                orderBy: 'startTime'
            }
        });

        const holidays = response.data.items.map(event => ({
            date: event.start.date,
            name: event.summary
        }));

        res.status(200).json(holidays);
        console.log("取得した祝日データ:", holidays);
    } catch (error) {
        console.error('祝日データ取得エラー:', error);
        res.status(500).json({ message: '祝日データの取得に失敗しました', error });
    }
};
