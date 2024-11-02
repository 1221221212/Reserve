const moment = require('moment-timezone');

// UTCのDate文字列をJSTのDateオブジェクトに変換する
exports.utcToJstDate = (date) => {
    return moment.utc(date).tz('Asia/Tokyo').format('YYYY-MM-DD');
};
