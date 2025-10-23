const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();

// Проверяем наличие токена
if (!process.env.BOT_TOKEN) {
  console.error('ERROR: BOT_TOKEN not found!');
  process.exit(1);
}

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

console.log('Bot starting...');

// Простейшая команда
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Hello! Bot is working!');
});

// Запускаем сервер
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Bot started successfully on port ' + PORT);
});
