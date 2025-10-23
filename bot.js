const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();

if (!process.env.BOT_TOKEN) {
  console.error('ERROR: BOT_TOKEN not found!');
  process.exit(1);
}

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

console.log('Bot starting...');

// Простые команды без эмодзи
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Привет! Я Анимадруг! Напиши /lesson для начала.');
});

bot.onText(/\/lesson/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Урок 1: Нарисуй 3 кадра прыгающего шарика!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Bot started on port ' + PORT);
});
