const moment = require('moment-timezone');

// UTCのDate文字列をJSTのDateオブジェクトに変換する
exports.utcToJstDate = (date) => {
    return moment.utc(date).tz('Asia/Tokyo').format('YYYY-MM-DD');
};

//秒がいらないとき
exports.removeSecond = (timeString) => {
    return moment(timeString, 'HH:mm:ss').format('HH:mm'); // 時間文字列から秒を削除
};