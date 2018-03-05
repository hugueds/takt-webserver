const Telegram  = require('node-telegram-bot-api');
// const token = process.env.BOT_TOKEN;
const token = '524715803:AAGc_UlcSRDnLW7VOm_XoTjehD9AMvtIVck';
const Bot = new Telegram(token, {    
    request: {
        proxy: "http://global%5Cssbhpe:Scania22@148.148.192.2:8080"
    }
});

Bot.on('message', (msg) => {
    console.log('message received');
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'I received a message');
});

module.exports = Bot;