const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

if (!process.env.BOT_TOKEN) {
  console.error('ERROR: BOT_TOKEN not found!');
  process.exit(1);
}

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

console.log('Бот Анимадруг запускается...');

// Хранилище прогресса пользователей
const userProgress = {};

// Ссылки на примеры гифок (бесплатные из интернета)
const EXAMPLE_GIFS = {
  lesson1: 'https://media.giphy.com/media/3o7aD2saQhM1WO5a2c/giphy.gif', // прыгающий шарик
  lesson2: 'https://media.giphy.com/media/l0HlGMcVJee6J6Jk4/giphy.gif', // бегущий человечек
  lesson3: 'https://media.giphy.com/media/26ufjJgVXvulqQNRC/giphy.gif'  // летающая птица
};

// Основное меню
const mainMenu = {
  reply_markup: {
    keyboard: [
      ['🎓 Начать урок', '📚 Примеры'],
      ['⭐ Мой прогресс', '❓ Помощь']
    ],
    resize_keyboard: true
  }
};

// Меню уроков
const lessonsMenu = {
  reply_markup: {
    keyboard: [
      ['📝 Урок 1: Прыгающий шарик'],
      ['🎨 Урок 2: Бегущий человечек'],
      ['✨ Урок 3: Летающая птица'],
      ['🔙 Назад в меню']
    ],
    resize_keyboard: true
  }
};

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'друг';
  
  if (!userProgress[chatId]) {
    userProgress[chatId] = {
      lessonsCompleted: [],
      currentLesson: null,
      lastActivity: new Date()
    };
  }

  const welcomeText = `Привет, ${userName}! Я Анимадруг! 🎨\n\nЯ помогу тебе освоить анимацию! Выбери, что хочешь сделать:`;
  bot.sendMessage(chatId, welcomeText, mainMenu);
});

// Обработка всех сообщений и кнопок
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const userName = msg.from.first_name || 'друг';

  if (text.startsWith('/')) return;

  if (!userProgress[chatId]) {
    userProgress[chatId] = {
      lessonsCompleted: [],
      currentLesson: null,
      lastActivity: new Date()
    };
  }

  switch(text) {
    case '🎓 Начать урок':
      bot.sendMessage(chatId, `Отлично, ${userName}! Выбери урок:`, lessonsMenu);
      break;

    case '📝 Урок 1: Прыгающий шарик':
      userProgress[chatId].currentLesson = 'lesson1';
      
      // Сначала отправляем гифку
      bot.sendAnimation(chatId, EXAMPLE_GIFS.lesson1, {
        caption: `Вот пример прыгающего шарика! 🎾\nОбрати внимание, как он сжимается и растягивается.`
      }).then(() => {
        // Потом отправляем задание
        const lesson1Text = `${userName}, теперь твоя очередь! 🎯\n\n` +
                           `📝 **Урок 1: Прыгающий шарик**\n\n` +
                           `🎯 **Задание:** Нарисуй 3 кадра:\n` +
                           `1. Шарик вверху (сжатый)\n` +
                           `2. Шарик внизу (растянутый)\n` +
                           `3. Шарик снова вверху\n\n` +
                           `Как нарисуешь - присылай свои кадры! 🎨`;
        return bot.sendMessage(chatId, lesson1Text, mainMenu);
      });
      break;

    case '🎨 Урок 2: Бегущий человечек':
      userProgress[chatId].currentLesson = 'lesson2';
      
      bot.sendAnimation(chatId, EXAMPLE_GIFS.lesson2, {
        caption: `Смотри, как движется бегущий человечек! 🏃‍♂️\nВидишь фазы движения?`
      }).then(() => {
        const lesson2Text = `${userName}, теперь твоя очередь! 🎭\n\n` +
                         `📝 **Урок 2: Бегущий человечек**\n\n` +
                         `🎯 **Задание:** Нарисуй 4 кадра:\n` +
                         `1. Подготовка к шагу\n` +
                         `2. Перенос веса\n` +
                         `3. Толчок\n` +
                         `4. Полётная фаза\n\n` +
                         `Жду твои рисунки! 🏃‍♂️`;
        return bot.sendMessage(chatId, lesson2Text, mainMenu);
      });
      break;

    case '✨ Урок 3: Летающая птица':
      userProgress[chatId].currentLesson = 'lesson3';
      
      bot.sendAnimation(chatId, EXAMPLE_GIFS.lesson3, {
        caption: `Посмотри на плавное движение птицы! 🕊️\nКрылья движутся волнообразно.`
      }).then(() => {
        const lesson3Text = `${userName}, теперь твоя очередь! 🌊\n\n` +
                         `📝 **Урок 3: Летающая птица**\n\n` +
                         `🎯 **Задание:** Нарисуй 3 кадра:\n` +
                         `1. Крылья вверх\n` +
                         `2. Крылья в середине\n` +
                         `3. Крылья внизу\n\n` +
                         `Ты справишься! Присылай свою птицу! 🕊️`;
        return bot.sendMessage(chatId, lesson3Text, mainMenu);
      });
      break;

    case '📚 Примеры':
      // Показываем все примеры сразу
      bot.sendMessage(chatId, `📚 **Все примеры анимаций:**\n\nСмотри, что ты научишься создавать! ✨`)
        .then(() => bot.sendAnimation(chatId, EXAMPLE_GIFS.lesson1, {caption: 'Прыгающий шарик'}))
        .then(() => bot.sendAnimation(chatId, EXAMPLE_GIFS.lesson2, {caption: 'Бегущий человечек'}))
        .then(() => bot.sendAnimation(chatId, EXAMPLE_GIFS.lesson3, {caption: 'Летающая птица'}))
        .then(() => {
          bot.sendMessage(chatId, 
            `Как тебе примеры? 💫\n\nВыбирай урок и начинай творить! У тебя всё получится! 🌟`, 
            mainMenu
          );
        });
      break;

    case '⭐ Мой прогресс':
      const progress = userProgress[chatId];
      const completedCount = progress.lessonsCompleted.length;
      
      let progressText = `⭐ **Твой прогресс, ${userName}:**\n\n`;
      progressText += `✅ Пройдено уроков: ${completedCount}/3\n`;
      
      if (completedCount === 0) {
        progressText += `🎯 Ты еще не начал(а) уроки - самое время начать!`;
      } else if (completedCount === 1) {
        progressText += `🎯 Отличное начало! Продолжай в том же духе!`;
      } else if (completedCount === 2) {
        progressText += `🎯 Здорово! Остался всего один урок!`;
      } else {
        progressText += `🎯 Потрясающе! Ты завершил(а) все уроки! Ты - настоящий аниматор! 🏆`;
      }
      
      bot.sendMessage(chatId, progressText, mainMenu);
      break;

    case '❓ Помощь':
      const helpText = `❓ **Помощь по боту:**\n\n` +
                      `Я здесь, чтобы помочь тебе научиться анимации!\n\n` +
                      `**Как пользоваться:**\n` +
                      `• 🎓 Начать урок - смотри пример и выполняй задание\n` +
                      `• 📚 Примеры - посмотри все примеры анимаций\n` +
                      `• ⭐ Мой прогресс - отслеживай свои успехи\n\n` +
                      `Нужна помощь? Пиши - помогу! 🤗`;
      bot.sendMessage(chatId, helpText, mainMenu);
      break;

    case '🔙 Назад в меню':
      bot.sendMessage(chatId, `Возвращаемся в главное меню! ✨`, mainMenu);
      break;

    default:
      if (msg.text && !msg.text.startsWith('/')) {
        bot.sendMessage(chatId, `Выбери действие из меню ниже 👇`, mainMenu);
      }
  }
});

// Обработка фотографий
bot.on('photo', (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'друг';
  const progress = userProgress[chatId];
  
  if (!progress) return;
  
  let response = '';
  
  if (progress.currentLesson === 'lesson1' && !progress.lessonsCompleted.includes(1)) {
    progress.lessonsCompleted.push(1);
    response = `Вау, ${userName}! Ты нарисовал(а) прыгающий шарик! 🎾\n\n` +
               `Сравни с примером - у тебя здорово получилось!\n\n` +
               `✅ **Урок 1 завершен!**\n\n` +
               `Переходи к следующему уроку! 🚀`;
  }
  else if (progress.currentLesson === 'lesson2' && !progress.lessonsCompleted.includes(2)) {
    progress.lessonsCompleted.push(2);
    response = `Потрясающе, ${userName}! Ты создал(а) бегущего человечка! 🏃‍♂️\n\n` +
               `Ты научился(ась) анимировать персонажей!\n\n` +
               `✅ **Урок 2 завершен!**\n\n` +
               `Так держать! 💪`;
  }
  else if (progress.currentLesson === 'lesson3' && !progress.lessonsCompleted.includes(3)) {
    progress.lessonsCompleted.push(3);
    response = `Восхитительно, ${userName}! Ты оживил(а) летающую птицу! 🕊️\n\n` +
               `Ты освоил(а) плавную анимацию!\n\n` +
               `✅ **Урок 3 завершен!**\n\n` +
               `🎉 **ПОЗДРАВЛЯЮ!** Ты - настоящий аниматор! 🏆`;
  }
  else {
    response = `Круто, ${userName}! Новый рисунок! 🎨\n\n` +
               `Продолжай практиковаться! ✨`;
  }
  
  progress.lastActivity = new Date();
  bot.sendMessage(chatId, response, mainMenu);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Бот Анимадруг работает на порту ' + PORT);
});
