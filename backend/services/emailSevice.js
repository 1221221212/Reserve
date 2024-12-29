const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.jp', // SMTPサーバー
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER, // メールアカウント
        pass: process.env.SMTP_PASS, // パスワード
    },
});

// 汎用メール送信関数
const sendEmail = async ({ to, subject, text, html, bcc }) => {
    try {
        const mailOptions = {
            from: `"美山お香" <${'reserve@miyamacoffee.com'}>`,
            to, // メインの送信先
            bcc, // 管理者をBCCに追加
            subject,
            text,
            html,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('メール送信成功:', result.messageId);
        return result;
    } catch (error) {
        console.error('メール送信失敗:', error);
        throw error;
    }
};

// 予約確認メール送信関数
const sendReservationConfirmation = async (to, reservationDetails) => {
    const subject = '【予約完了】ご予約内容の確認';
    
    const html = `
                    <!DOCTYPE html>
                    <html lang="ja">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                                color: #333;
                                margin: 0;
                                padding: 0;
                                background-color: #f4f4f4;
                            }
                            .container {
                                max-width: 600px;
                                margin: 20px auto;
                                background: #fff;
                                border: 1px solid #ddd;
                                padding: 20px;
                                border-radius: 10px;
                            }
                            .header {
                                text-align: center;
                                color: #4CAF50;
                            }
                            .table {
                                width: 100%;
                                border-collapse: collapse;
                                margin: 20px 0;
                            }
                            .table th, .table td {
                                padding: 10px;
                                border: 1px solid #ddd;
                                text-align: left;
                            }
                            .table th {
                                background: #f9f9f9;
                                font-weight: bold;
                            }
                            .button {
                                display: inline-block;
                                padding: 10px 20px;
                                color: #fff;
                                background: #4CAF50;
                                text-decoration: none;
                                border-radius: 5px;
                            }
                            .footer {
                                text-align: center;
                                color: #555;
                                margin-top: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2 class="header">ご予約内容の確認</h2>
                            <p>以下の内容で予約が確定しました。</p>
                            <table class="table">
                                <tr>
                                    <th>予約番号</th>
                                    <td>R5X0121</td>
                                </tr>
                                <tr>
                                    <th>お名前</th>
                                    <td>岩佐 尚樹</td>
                                </tr>
                                <tr>
                                    <th>日時</th>
                                    <td>2024-12-16 13:00 - 17:00</td>
                                </tr>
                                <tr>
                                    <th>人数</th>
                                    <td>2</td>
                                </tr>
                            </table>
                            <div class="footer">
                                ご利用ありがとうございます！
                            </div>
                            <div style="text-align: center; margin-top: 20px;">
                                <a href="https://miyamacoffee.com" class="button">予約内容を確認する</a>
                            </div>
                        </div>
                    </body>
                    </html>
    `;

    await transporter.sendMail({
        from: `"美山お香" <${'reserve@miyamacoffee.com'}`,
        to,
        bcc: process.env.ADMIN_EMAIL,
        subject,
        text: `
                予約番号: ${reservationDetails.reservation_number}
                お名前: ${reservationDetails.customer_name}
                日時: ${reservationDetails.date} ${reservationDetails.start_time} - ${reservationDetails.end_time}
                人数: ${reservationDetails.group_size}

                ご利用ありがとうございます！
        `,
        html,
    });
    console.log('予約確認メール送信成功');
};


module.exports = {
    sendReservationConfirmation, // エクスポート
};

const sendReservationCancellation = async (to, reservationDetails) => {
    const subject = '【予約キャンセル】キャンセル内容の確認';
    const text = `以下の予約がキャンセルされました。\n\n${JSON.stringify(reservationDetails, null, 2)}`;
    const html = `
        <p>キャンセル内容の確認</p>
        <ul>
            <li>予約番号: ${reservationDetails.reservation_number}</li>
            <li>日時: ${reservationDetails.date} ${reservationDetails.time}</li>
            <li>人数: ${reservationDetails.group_size}</li>
        </ul>
    `;
    return sendEmail({
        to, 
        bcc: process.env.ADMIN_EMAIL, // 管理者をBCCに追加
        subject, 
        text, 
        html,
    });
};
