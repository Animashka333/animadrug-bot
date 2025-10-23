const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// Импортируем наши модули
const { MESSAGES, MENU_BUTTONS } = require('./config/constants');
const { getMainMenu, getLessonsMenu } = require('./utils/keyboard');
const lesson1 = require('./lessons/lesson1');

const app = express();

// Проверка токена
if (!process.env.BOT_TOKEN) {
  console.error('ERROR: BOT_TOKEN not found!');
  process.exit(1);
}

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

console.log('Bot starting with interactive menu...');

// Хранилище прогресса пользователей (временное)
const userProgress = {};

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'друг';
  
  // Инициализируем прогресс пользователя
  if (!userProgress[chatId]) {
    userProgress[chatId] = {
      lessonsCompleted: 0,
      currentLesson: null,
      lastActivity: new Date()
    };
  }

  const welcomeMessage = `Привет, ${userName}! ${MESSAGES.WELCOME}`;
  
  bot.sendMessage(chatId, welcomeMessage, getMainMenu());
});

// Обработчик текстовых сообщений (кнопки)
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const userName = msg.from.first_name || 'друг';

  if (!userProgress[chatId]) {
    userProgress[chatId] = {
      lessonsCompleted: 0,
      currentLesson: null,
      lastActivity: new Date()
    };
  }

  // Обработка нажатий кнопок
  switch(text) {
    case MENU_BUTTONS.START_LESSON:
      const lessonsMessage = `Отлично, ${userName}! Выбери урок:\n\n` +
                           `Каждый урок - это новый шаг в мире анимации! 🌈`;
      bot.sendMessage(chatId, lessonsMessage, getLessonsMenu());
      break;

    case '📝 Урок 1: Прыгающий шарик':
      const lessonContent = lesson1.getContent(userName);
      userProgress[chatId].currentLesson = 'lesson1';
      bot.sendMessage(chatId, lessonContent.text, {
        ...lessonContent.options,
        ...getMainMenu()
      });
      break;

    case MENU_BUTTONS.EXAMPLES:
      const examplesMessage = `📚 **Примеры анимаций:**\n\n` +
                            `Вот что ты сможешь создавать:\n` +
                            `• Простые движения (шарик, мячик)\n` +
                            `• Ходьба персонажей\n` +
                            `• Полет птиц и насекомых\n` +
                            `• Эмоции и выражения лиц\n\n` +
                            `Начни с первого урока - и скоро ты сам создашь такие же крутые анимации! 🎬`;
      bot.sendMessage(chatId, examplesMessage, getMainMenu());
      break;

    case MENU_BUTTONS.PROGRESS:
      const progress = userProgress[chatId];
      const progressMessage = `⭐ **Твой прогресс, ${userName}:**\n\n` +
                            `✅ Пройдено уроков: ${progress.lessonsCompleted}\n` +
                            `📖 Текущий урок: ${progress.currentLesson ? 'Урок 1' : 'еще не начат'}\n` +
                            `🎯 Активность: ${progress.lastActivity.toLocaleDateString()}\n\n` +
                            `Продолжай в том же духе! Каждый урок приближает тебя к мастерству! 💪`;
      bot.sendMessage(chatId, progressMessage, getMainMenu());
      break;

    case MENU_BUTTONS.HELP:
      const helpMessage = `❓ **Помощь по боту:**\n\n` +
                         `Я здесь, чтобы помочь тебе научиться анимации!\n\n` +
                         `**Как пользоваться:**\n` +
                         `• 🎓 Начать урок - выбери урок и следуй инструкциям\n` +
                         `• 📚 Примеры - посмотри, что ты сможешь создать\n` +
                         `• ⭐ Мой прогресс - отслеживай свои успехи\n\n` +
                         `Нужна помощь с конкретным заданием? Просто напиши мне - помогу! 🤗`;
      bot.sendMessage(chatId, helpMessage, getMainMenu());
      break;

    case '🔙 Назад в меню':
      bot.sendMessage(chatId, MESSAGES.MENU, getMainMenu());
      break;

    default:
      // Если сообщение не является командой, предлагаем меню
      if (!text.startsWith('/')) {
        bot.sendMessage(chatId, 
          `Классно! Но давай лучше выберем что-то из меню ниже 👇`, 
          getMainMenu()
        );
      }
  }
});

// Обработчик для отправки изображений
bot.on('photo', (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'друг';
  
  const response = `Вау, ${userName}! Это твоя работа? 🎨\n\n` +
                  `Отлично! Ты прислал изображение! Когда ты закончишь все кадры анимации, собери их в гифку и присылай - буду ждать с нетерпением! ✨`;
  
  bot.sendMessage(chatId, response, getMainMenu());
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Bot server started on port ' + PORT);
});

module.exports = bot;
