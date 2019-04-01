process.env.NTBA_FIX_319 = 1;

const d = require('dotenv').config();
const Telegram  = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN || '524715803:AAGc_UlcSRDnLW7VOm_XoTjehD9AMvtIVck';

// const proxyUser = process.env.PROXY_USER
// const proxyServer = process.env.PROXY_SERVER;
// const proxyPass = process.env.PROXY_PASSWORD;

const proxyUser = 'ServiceLTS'
const proxyServer = '148.148.192.2:8080';
const proxyPass = '0]!VJ^oxoMQKXQp';

const proxy = 'http://' + proxyUser + ':' + proxyPass + '@' + proxyServer;

const Bot = new Telegram(token, {    
    request: {
        proxy: proxy
    }
});

Bot.on('message', (msg) => {
    console.log('message received', msg.chat);
    const chatId = msg.chat.id;    
    bot.sendMessage(chatId, 'I received a message');
});

module.exports = Bot;