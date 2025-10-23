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

// Бот реагирует на команду /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const text = 'Привет! Я Анимадруг!';
  bot.sendMessage(chatId, text);
});

bot.onText(/\/lesson/, (msg) => {
  const chatId = msg.chat.id;
  const lessonText = 'Урок 1: Нарисуй 3 кадра прыгающего шарика!';
  bot.sendMessage(chatId, lessonText);
});

bot.onText(/\/about/, (msg) => {
  const chatId = msg.chat.id;
  const aboutText = 'Я - Анимадруг! Помогаю изучать анимацию.';
  bot.sendMessage(chatId, aboutText);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Bot started on port ' + PORT);
});
