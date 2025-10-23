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

console.log('🤖 Анимадруг запускается...');

// Бот реагирует на команду /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const text = Привет! Я Анимадруг! 🎨\nТвой помощник в мире анимации!\n\nВыбери действие:\n/lesson - Начать урок\n/about - Обо мне;
  bot.sendMessage(chatId, text);
});

// Бот реагирует на команду /lesson  
bot.onText(/\/lesson/, (msg) => {
  const chatId = msg.chat.id;
  const lessonText = 🎯 Урок 1: "Оживляем шарик"\n\nПринцип СЖАТИЯ и РАСТЯЖЕНИЯ:\n• Шарик растягивается в прыжке\n• Сжимается при ударе\n• Сохраняет объем\n\n✨ Задание: Нарисуй 3 кадра прыгающего шарика!;
  bot.sendMessage(chatId, lessonText);
});

// Бот реагирует на команду /about
bot.onText(/\/about/, (msg) => {
  const chatId = msg.chat.id;
  const aboutText = Я - Анимадруг! 🤝\nПомогаю подросткам освоить анимацию с нуля.\n\nЧто я умею:\n• Объяснять сложное простыми словами\n• Давать пошаговые задания\n• Поддерживать и мотивировать!\n\nВерсия: 1.0;
  bot.sendMessage(chatId, aboutText);
});

// Запускаем сервер
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🤖 Анимадруг УСПЕШНО запущен! Порт: ' + PORT);
});
