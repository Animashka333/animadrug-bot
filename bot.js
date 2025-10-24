const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

if (!process.env.BOT_TOKEN) {
  console.error('ERROR: BOT_TOKEN not found!');
  process.exit(1);
}

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

console.log('🤖 Бот Анимадруг запускается...');

const userProgress = {};

// Ссылки на изображения с примерами анимаций
const LESSON_IMAGES = {
  lesson1: 'https://i.imgur.com/3Q1Za9O.gif', // прыгающий шарик
  lesson2: 'https://i.imgur.com/7Vn3Ue4.gif', // бегущий человечек
  lesson3: 'https://i.imgur.com/5Wn7R3c.gif'  // летающая птица
};

const mainMenu = {
  reply_markup: {
    keyboard: [
      ['🎓 Начать урок', '📚 Примеры'],
      ['⭐ Мой прогресс', '❓ Помощь']
    ],
    resize_keyboard: true
  }
};

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

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'друг';
  
  if (!userProgress[chatId]) {
    userProgress[chatId] = {
      lessonsCompleted: [],
      currentLesson: null
    };
  }

  bot.sendMessage(chatId, 
    `Привет, ${userName}! Я Анимадруг! 🎨\n\nЯ помогу тебе освоить анимацию! Выбери действие:`, 
    mainMenu
  );
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const userName = msg.from.first_name || 'друг';

  if (text.startsWith('/')) return;

  if (!userProgress[chatId]) {
    userProgress[chatId] = {
      lessonsCompleted: [],
      currentLesson: null
    };
  }

  switch(text) {
    case '🎓 Начать урок':
      bot.sendMessage(chatId, `Выбери урок:`, lessonsMenu);
      break;

    case '📝 Урок 1: Прыгающий шарик':
      userProgress[chatId].currentLesson = 'lesson1';
      
      // Отправляем изображение с примером
      bot.sendPhoto(chatId, LESSON_IMAGES.lesson1, {
        caption: `🎾 **Пример прыгающего шарика**\n\nСмотри, как шарик меняет форму при движении!`
      }).then(() => {
        // Затем отправляем задание
        const lessonText = `📝 **Урок 1: Прыгающий шарик**\n\n` +
                         `🎯 **Твое задание:**\n` +
                         `Нарисуй 3 кадра прыгающего шарика:\n\n` +
                         `1. Шарик вверху (сжатый)\n` +
                         `2. Шарик внизу (растянутый)\n` +
                         `3. Шарик снова вверху\n\n` +
                         `💡 **Совет:** Обрати внимание, как шарик растягивается при падении и сжимается при отскоке!\n\n` +
                         `Присылай свои рисунки! 🎨`;
        bot.sendMessage(chatId, lessonText, mainMenu);
      });
      break;

    case '🎨 Урок 2: Бегущий человечек':
      userProgress[chatId].currentLesson = 'lesson2';
      
      bot.sendPhoto(chatId, LESSON_IMAGES.lesson2, {
        caption: `🏃‍♂️ **Пример бегущего человечка**\n\nВидишь фазы движения?`
      }).then(() => {
        const lessonText = `📝 **Урок 2: Бегущий человечек**\n\n` +
                         `🎯 **Твое задание:**\n` +
                         `Нарисуй 4 кадра бегущего человечка:\n\n` +
                         `1. Подготовка к шагу\n` +
                         `2. Перенос веса\n` +
                         `3. Толчок\n` +
                         `4. Полётная фаза\n\n` +
                         `💡 **Совет:** Начни с простого "скелета" из палочек!\n\n` +
                         `Жду твои рисунки! 🏃‍♂️`;
        bot.sendMessage(chatId, lessonText, mainMenu);
      });
      break;

    case '✨ Урок 3: Летающая птица':
      userProgress[chatId].currentLesson = 'lesson3';
      
      bot.sendPhoto(chatId, LESSON_IMAGES.lesson3, {
        caption: `🕊️ **Пример летающей птицы**\n\nОбрати внимание на плавное движение крыльев!`
      }).then(() => {
        const lessonText = `📝 **Урок 3: Летающая птица**\n\n` +
                         `🎯 **Твое задание:**\n` +
                         `Нарисуй 3 кадра летающей птицы:\n\n` +
                         `1. Крылья вверху\n` +
                         `2. Крылья посередине\n` +
                         `3. Крылья внизу\n\n` +
                         `💡 **Совет:** Сделай движение плавным и волнообразным!\n\n` +
                         `Ты справишься! 🕊️`;
        bot.sendMessage(chatId, lessonText, mainMenu);
      });
      break;

    case '📚 Примеры':
      // Показываем все примеры
      bot.sendMessage(chatId, `📚 **Примеры анимаций:**\n\nСмотри, что ты научишься создавать!`)
        .then(() => bot.sendPhoto(chatId, LESSON_IMAGES.lesson1, {caption: '🎾 Прыгающий шарик'}))
        .then(() => bot.sendPhoto(chatId, LESSON_IMAGES.lesson2, {caption: '🏃‍♂️ Бегущий человечек'}))
        .then(() => bot.sendPhoto(chatId, LESSON_IMAGES.lesson3, {caption: '🕊️ Летающая птица'}))
        .then(() => {
          bot.sendMessage(chatId, 
            `Как тебе примеры? ✨\n\nВыбирай урок и начинай творить! У тебя всё получится!`, 
            mainMenu
          );
        });
      break;

    case '⭐ Мой прогресс':
      const progress = userProgress[chatId];
      const completed = progress.lessonsCompleted.length;
      
      let progressText = `⭐ **Твой прогресс, ${userName}:**\n\n` +
                         `✅ Пройдено уроков: ${completed}/3\n\n`;
      
      if (completed === 0) {
        progressText += `Ты еще не начал(а) уроки - самое время начать! 🚀`;
      } else if (completed === 1) {
        progressText += `Отличное начало! Продолжай в том же духе! 💪`;
      } else if (completed === 2) {
        progressText += `Здорово! Остался всего один урок! 🌟`;
      } else {
        progressText += `Потрясающе! Ты завершил(а) все уроки! Ты - настоящий аниматор! 🏆`;
      }
      
      bot.sendMessage(chatId, progressText, mainMenu);
      break;

    case '❓ Помощь':
      const helpText = `❓ **Помощь**\n\n` +
                       `Я здесь, чтобы помочь тебе научиться анимации!\n\n` +
                       `**Как пользоваться:**\n` +
                       `• 🎓 Начать урок - смотри пример и выполняй задание\n` +
                       `• 📚 Примеры - посмотри все примеры анимаций\n` +
                       `• ⭐ Мой прогресс - отслеживай свои успехи\n\n` +
                       `Просто выбирай урок, смотри пример и присылай свои рисунки! 🤗`;
      bot.sendMessage(chatId, helpText, mainMenu);
      break;

    case '🔙 Назад в меню':
      bot.sendMessage(chatId, `Возвращаемся в главное меню! ✨`, mainMenu);
      break;

    default:
      if (msg.text && !msg.text.startsWith('/')) {
        bot.sendMessage(chatId, `Используй кнопки меню 👇`, mainMenu);
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
               `Продолжай практиковаться - у тебя отлично получается! ✨`;
  }
  
  bot.sendMessage(chatId, response, mainMenu);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Бот запущен на порту ${PORT}`);
});
