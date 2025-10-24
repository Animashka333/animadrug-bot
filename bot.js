const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// Проверяем токен бота
if (!process.env.BOT_TOKEN) {
  console.error('ERROR: BOT_TOKEN not found!');
  process.exit(1);
}

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

console.log('Бот Анимадруг запускается...');

// Хранилище прогресса пользователей
const userProgress = {};

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
  
  // Создаем запись о прогрессе для нового пользователя
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

  // Пропускаем команды (они обрабатываются отдельно)
  if (text.startsWith('/')) return;

  // Создаем запись о прогрессе, если пользователь новый
  if (!userProgress[chatId]) {
    userProgress[chatId] = {
      lessonsCompleted: [],
      currentLesson: null,
      lastActivity: new Date()
    };
  }

  // Обработка нажатий кнопок
  switch(text) {
    case '🎓 Начать урок':
      bot.sendMessage(chatId, 
        `Отлично, ${userName}! Выбери урок:\n\n` +
        `Каждый урок - это новый шаг в мире анимации! 🌈`, 
        lessonsMenu
      );
      break;

    case '📝 Урок 1: Прыгающий шарик':
      userProgress[chatId].currentLesson = 'lesson1';
      userProgress[chatId].lastActivity = new Date();
      
      const lesson1Text = `${userName}, давай создадим твою первую анимацию! 🎯\n\n` +
                         `📝 **Урок 1: Прыгающий шарик**\n\n` +
                         `🎯 **Задание:** Нарисуй 3 кадра прыгающего шарика:\n` +
                         `1. Шарик вверху (сжатый)\n` +
                         `2. Шарик внизу (растянутый)\n` +
                         `3. Шарик снова вверху\n\n` +
                         `💡 **Совет:** Используй простые формы! При движении вниз шарик растягивается, а вверх - сжимается!\n\n` +
                         `Как нарисуешь - присылай свои кадры! 🎨`;
      
      bot.sendMessage(chatId, lesson1Text, mainMenu);
      break;

    case '🎨 Урок 2: Бегущий человечек':
      userProgress[chatId].currentLesson = 'lesson2';
      userProgress[chatId].lastActivity = new Date();
      
      const lesson2Text = `${userName}, переходим к анимации персонажей! 🎭\n\n` +
                         `📝 **Урок 2: Бегущий человечек**\n\n` +
                         `🎯 **Задание:** Нарисуй 4 кадра бегущего человечка:\n` +
                         `1. Подготовка к шагу (руки и ноги в крайних положениях)\n` +
                         `2. Перенос веса (одна нога на земле)\n` +
                         `3. Толчок (другая нога отрывается)\n` +
                         `4. Полётная фаза (обе ноги в воздухе)\n\n` +
                         `💡 **Совет:** Начни с "скелета" из палочек, потом добавь тело!\n\n` +
                         `Жду твои рисунки! 🏃‍♂️`;
      
      bot.sendMessage(chatId, lesson2Text, mainMenu);
      break;

    case '✨ Урок 3: Летающая птица':
      userProgress[chatId].currentLesson = 'lesson3';
      userProgress[chatId].lastActivity = new Date();
      
      const lesson3Text = `${userName}, время освоить плавное движение! 🌊\n\n` +
                         `📝 **Урок 3: Летающая птица**\n\n` +
                         `🎯 **Задание:** Нарисуй 3 кадра летящей птицы:\n` +
                         `1. Крылья вверх\n` +
                         `2. Крылья в середине\n` +
                         `3. Крылья внизу\n\n` +
                         `💡 **Совет:** Сделай движение плавным - каждый следующий кадр немного отличается от предыдущего!\n\n` +
                         `Ты справишься! Присылай свою птицу! 🕊️`;
      
      bot.sendMessage(chatId, lesson3Text, mainMenu);
      break;

    case '📚 Примеры':
      const examplesText = `📚 **Примеры анимаций:**\n\n` +
                          `Вот что ты сможешь создавать:\n` +
                          `• Прыгающий шарик (простое движение)\n` +
                          `• Бегущий человечек (анимация персонажей)\n` +
                          `• Летающая птица (плавное движение)\n` +
                          `• Танцующее облако (творческая анимация)\n\n` +
                          `Начни с первого урока - у тебя всё получится! 🌟`;
      
      bot.sendMessage(chatId, examplesText, mainMenu);
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
      
      progressText += `\n\nВыбирай следующий урок и продолжаем творить! ✨`;
      
      bot.sendMessage(chatId, progressText, mainMenu);
      break;

    case '❓ Помощь':
      const helpText = `❓ **Помощь по боту:**\n\n` +
                      `Я здесь, чтобы помочь тебе научиться анимации!\n\n` +
                      `**Как пользоваться:**\n` +
                      `• 🎓 Начать урок - выбери урок и следуй инструкциям\n` +
                      `• 📚 Примеры - посмотри, что ты сможешь создать\n` +
                      `• ⭐ Мой прогресс - отслеживай свои успехи\n\n` +
                      `Нужна помощь с конкретным заданием? Просто напиши мне - помогу! 🤗`;
      
      bot.sendMessage(chatId, helpText, mainMenu);
      break;

    case '🔙 Назад в меню':
      bot.sendMessage(chatId, `Возвращаемся в главное меню! ✨`, mainMenu);
      break;

    default:
      // Если сообщение не распознано, показываем меню
      if (msg.text && !msg.text.startsWith('/')) {
        bot.sendMessage(chatId, 
          `Выбери действие из меню ниже 👇`, 
          mainMenu
        );
      }
  }
});

// Обработка фотографий - отмечаем пройденные уроки
bot.on('photo', (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'друг';
  const progress = userProgress[chatId];
  
  if (!progress) return;
  
  let response = '';
  let lessonCompleted = false;
  
  // Проверяем, за какой урок пользователь прислал работу
  if (progress.currentLesson === 'lesson1' && !progress.lessonsCompleted.includes(1)) {
    progress.lessonsCompleted.push(1);
    lessonCompleted = true;
    response = `Вау, ${userName}! Ты нарисовал(а) прыгающий шарик! 🎾\n\n` +
               `Это отличное начало! Ты освоил(а) базовые принципы анимации!\n\n` +
               `✅ **Урок 1 завершен!**\n\n` +
               `Переходи к следующему уроку - там будет еще интереснее! 🚀`;
  }
  else if (progress.currentLesson === 'lesson2' && !progress.lessonsCompleted.includes(2)) {
    progress.lessonsCompleted.push(2);
    lessonCompleted = true;
    response = `Потрясающе, ${userName}! Ты создал(а) бегущего человечка! 🏃‍♂️\n\n` +
               `Ты научился(ась) анимировать персонажей - это серьезный шаг!\n\n` +
               `✅ **Урок 2 завершен!**\n\n` +
               `Так держать! Остался последний урок! 💪`;
  }
  else if (progress.currentLesson === 'lesson3' && !progress.lessonsCompleted.includes(3)) {
    progress.lessonsCompleted.push(3);
    lessonCompleted = true;
    response = `Восхитительно, ${userName}! Ты оживил(а) летающую птицу! 🕊️\n\n` +
               `Ты освоил(а) плавную анимацию - это высший пилотаж!\n\n` +
               `✅ **Урок 3 завершен!**\n\n` +
               `🎉 **ПОЗДРАВЛЯЮ!** Ты завершил(а) все уроки! Ты - настоящий аниматор! 🏆`;
  }
  else {
    response = `Круто, ${userName}! Новый рисунок! 🎨\n\n` +
               `Продолжай практиковаться - у тебя отлично получается! ✨`;
  }
  
  // Обновляем время последней активности
  progress.lastActivity = new Date();
  
  bot.sendMessage(chatId, response, mainMenu);
});

// Запускаем сервер для Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Бот Анимадруг работает на порту ' + PORT);
});
