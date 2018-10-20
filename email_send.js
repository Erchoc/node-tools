const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
{
    service: 'QQ', // https://github.com/nodemailer/nodemailer-wellknown/blob/master/services.json
    auth: {
        user: '310932019@qq.com',  // 发送者邮箱
        pass: 'mryggsssxijobhhg',  // 邮箱第三方登录授权码
    },
    debug: true
},{
    from: '310932019@qq.com', // 发送者邮箱
    headers: {
        'X-Laziness-level': 1000
    }
});

const message = {
    // Comma separated lsit of recipients 收件人用逗号间隔
    to: 'erchoc@163.com',
    // Subject of the message 信息主题
    subject:  '考金榜平台微信端生成的试卷模板',
    // plaintext body
    text: 'Hello to mylove~', // html优先级高于text
    // Html body
    html: '<p><b>这是您在考金榜微信端获取的试卷模板，请妥善保管</b></p>' + 
         '<p>作为测试，我这里贴图一张以示尊敬：<br/><img src="cid:001"/></p>',
    // Apple Watch specific HTML body 苹果手表指定HTML格式
    watchHtml: '<b>Hello</b> to myself',
    // An array of attachments 附件参考文档：https://nodemailer.com/message/attachments/
    attachments: [
        // String attachment
        {
             filename: '考金榜模板真题一.txt',
             path: './public/info.txt',
             encoding: 'utf-8',
        }
    ]

};

transporter.sendMail(message, (error, info) => {
    if (error) {
        console.log(`Error occurred: ${error.message}`);
        return false;
    }
    console.log(`Message Sent Successfully! ${info.response}`);
    transporter.close();
});
