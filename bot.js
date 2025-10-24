const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// Проверяем токен
if (!process.env.BOT_TOKEN) {
  console.error('ERROR: BOT_TOKEN not found!');
  process.exit(1);
}

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

console.log('🤖 Бот запускается...');

// Простое хранилище прогресса
const userProgress = {};

// Меню
const mainMenu = {
  reply_markup: {
    keyboard: [
      ['🎓 Уроки', '📚 Примеры'],
      ['⭐ Прогресс', '❓ Помощь']
    ],
    resize_keyboard: true
  }
};

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'друг';
  
  console.log(`👋 Новый пользователь: ${userName}`);
  
  const welcomeText = `Привет, ${userName}! Я Анимадруг! 🎨\n\nЯ помогу тебе освоить анимацию!`;
  bot.sendMessage(chatId, welcomeText, mainMenu);
});

// Обработчик всех сообщений
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const userName = msg.from.first_name || 'друг';

  console.log(`📨 Сообщение от ${userName}: ${text}`);

  // Инициализируем прогресс если нужно
  if (!userProgress[chatId]) {
    userProgress[chatId] = { lessonsCompleted: [] };
  }

  // Обработка кнопок
  if (text === '🎓 Уроки') {
    const lessonsText = `Выбери урок анимации:\n\n` +
                       `1. 📝 Прыгающий шарик\n` +
                       `2. 🎨 Бегущий человечек\n` +
                       `3. ✨ Летающая птица\n\n` +
                       `Напиши номер урока (1, 2 или 3)`;
    bot.sendMessage(chatId, lessonsText, mainMenu);
  }
  else if (text === '1' || text === '📝 Прыгающий шарик') {
    const lessonText = `🎾 **Урок 1: Прыгающий шарик**\n\n` +
                       `**Задание:** Нарисуй 3 кадра:\n` +
                       `1. Шарик вверху (сжатый)\n` +
                       `2. Шарик внизу (растянутый)\n` +
                       `3. Шарик снова вверху\n\n` +
                       `**Пример:**\n` +
                       `Кадр 1: ○ (вверху)\n` +
                       `Кадр 2: O (внизу, растянутый)\n` +
                       `Кадр 3: ○ (снова вверху)\n\n` +
                       `Присылай свои рисунки! 🎨`;
    bot.sendMessage(chatId, lessonText, mainMenu);
  }
  else if (text === '2' || text === '🎨 Бегущий человечек') {
    const lessonText = `🏃‍♂️ **Урок 2: Бегущий человечек**\n\n` +
                       `**Задание:** Нарисуй 4 кадра бега:\n` +
                       `1. Подготовка к шагу\n` +
                       `2. Перенос веса\n` +
                       `3. Толчок\n` +
                       `4. Полётная фаза\n\n` +
                       `Начни с простого человечка из палочек!`;
    bot.sendMessage(chatId, lessonText, mainMenu);
  }
  else if (text === '3' || text === '✨ Летающая птица') {
    const lessonText = `🕊️ **Урок 3: Летающая птица**\n\n` +
                       `**Задание:** Нарисуй 3 кадра:\n` +
                       `1. Крылья вверху\n` +
                       `2. Крылья посередине\n` +
                       `3. Крылья внизу\n\n` +
                       `Сделай движение плавным!`;
    bot.sendMessage(chatId, lessonText, mainMenu);
  }
  else if (text === '📚 Примеры') {
    const examplesText = `📚 **Примеры анимаций:**\n\n` +
                         `🎾 **Прыгающий шарик:**\n` +
                         `Шарик меняет форму при движении!\n\n` +
                         `🏃‍♂️ **Бегущий человечек:**\n` +
                         `Цикл из 4 фаз бега\n\n` +
                         `🕊️ **Летающая птица:**\n` +
                         `Плавное движение крыльев\n\n` +
                         `Выбирай урок и начинай творить! ✨`;
    bot.sendMessage(chatId, examplesText, mainMenu);
  }
  else if (text === '⭐ Прогресс') {
    const progress = userProgress[chatId];
    const completed = progress.lessonsCompleted.length;
    
    let progressText = `⭐ **Твой прогресс, ${userName}:**\n\n` +
                       `✅ Пройдено уроков: ${completed}/3\n\n`;
    
    if (completed === 0) {
      progressText += `Начни свой первый урок! 🚀`;
    } else if (completed === 3) {
      progressText += `Ты завершил(а) все уроки! 🏆`;
    } else {
      progressText += `Продолжай в том же духе! 💪`;
    }
    
    bot.sendMessage(chatId, progressText, mainMenu);
  }
  else if (text === '❓ Помощь') {
    const helpText = `❓ **Помощь:**\n\n` +
                     `Я помогу тебе научиться анимации!\n\n` +
                     `• 🎓 Уроки - выбери и пройди урок\n` +
                     `• 📚 Примеры - посмотри примеры\n` +
                     `• ⭐ Прогресс - узнай свои успехи\n\n` +
                     `Просто нажимай кнопки в меню!`;
    bot.sendMessage(chatId, helpText, mainMenu);
  }
  else if (text === '/help' || text === '/start') {
    // Эти команды уже обрабатываются отдельно
  }
  else {
    // Если сообщение не распознано
    bot.sendMessage(chatId, 
      `Используй кнопки меню ниже 👇\nИли напиши /start для перезапуска`, 
      mainMenu
    );
  }
});

// Обработка фото
bot.on('photo', (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'друг';
  
  console.log(`📸 ${userName} отправил(а) фото`);
  
  const response = `Круто, ${userName}! Ты отправил(а) рисунок! 🎨\n\n` +
                   `Продолжай практиковаться - у тебя отлично получается! ✨`;
  
  bot.sendMessage(chatId, response, mainMenu);
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Бот запущен на порту ${PORT}`);
});

// Обработка ошибок
bot.on('error', (error) => {
  console.error('❌ Ошибка бота:', error);
});

process.on('uncaughtException', (error) => {
  console.error('⚠️ Необработанная ошибка:', error);
});
