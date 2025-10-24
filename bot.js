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

// ВРЕМЕННО - пока нет картинок, но структура готова
const LESSON_IMAGES = {
  lesson1: '', // сюда вставим ссылку когда будет
  lesson2: '', 
  lesson3: ''
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
      
      const lesson1Text = `🎾 **УРОК 1: ПРЫГАЮЩИЙ ШАРИК**\n\n` +
                         `*Основы анимации:*\n\n` +
                         `📖 *Принцип сжатия и растяжения:*\n` +
                         `- При падении шарик растягивается\n` +
                         `- При ударе о землю - сжимается\n` +
                         `- При отскоке - снова растягивается\n\n` +
                         `🎯 *Твое задание:*\n` +
                         `Нарисуй 8 кадров прыгающего шарика:\n\n` +
                         `1. Шарик вверху (круглый)\n` +
                         `2. Начинает падать (немного растянут)\n` +
                         `3. Быстро летит вниз (сильно растянут)\n` +
                         `4. Удар о землю (сплюснутый)\n` +
                         `5. Начинает отскакивать (растянут)\n` +
                         `6. Быстро летит вверх (растянут)\n` +
                         `7. Замедляется (менее растянут)\n` +
                         `8. В верхней точке (круглый)\n\n` +
                         `💡 *Профессиональный совет:*\n` +
                         `- Кадры внизу располагай ближе друг к другу (быстрое движение)\n` +
                         `- Кадры вверху - дальше (медленное движение)\n\n` +
                         `Присылай свои кадры! 🎨`;
      
      bot.sendMessage(chatId, lesson1Text, mainMenu);
      break;

    case '🎨 Урок 2: Бегущий человечек':
      userProgress[chatId].currentLesson = 'lesson2';
      
      const lesson2Text = `🏃‍♂️ **УРОК 2: БЕГУЩИЙ ЧЕЛОВЕЧЕК**\n\n` +
                         `*Анимация персонажей:*\n\n` +
                         `📖 *Цикл бега:*\n` +
                         `- Движение рук и ног в противофазе\n` +
                         `- Тело немного наклоняется вперед\n` +
                         `- Голова остается на одной высоте\n\n` +
                         `🎯 *Твое задание:*\n` +
                         `Нарисуй 6 кадров бегущего человечка:\n\n` +
                         `1. Контакт (нога касается земли)\n` +
                         `2. Низшая точка (нога согнута)\n` +
                         `3. Отрыв (нога отталкивается)\n` +
                         `4. Мах (нога в воздухе)\n` +
                         `5. Высшая точка (подготовка к шагу)\n` +
                         `6. Снова контакт\n\n` +
                         `💡 *Профессиональный совет:*\n` +
                         `- Добавь небольшое подпрыгивание тела\n` +
                         `- Руки двигаются противоположно ногам\n\n` +
                         `Жду твои рисунки! 🏃‍♂️`;
      
      bot.sendMessage(chatId, lesson2Text, mainMenu);
      break;

    case '✨ Урок 3: Летающая птица':
      userProgress[chatId].currentLesson = 'lesson3';
      
      const lesson3Text = `🕊️ **УРОК 3: ЛЕТАЮЩАЯ ПТИЦА**\n\n` +
                         `*Плавная анимация:*\n\n` +
                         `📖 *Волнообразное движение:*\n` +
                         `- Крылья движутся по траектории "восьмерки"\n` +
                         `- Тело немного приподнимается и опускается\n` +
                         `- Хвост помогает управлять полетом\n\n` +
                         `🎯 *Твое задание:*\n` +
                         `Нарисуй 5 кадров летающей птицы:\n\n` +
                         `1. Крылья внизу (начало взмаха)\n` +
                         `2. Крылья вперед и вверх\n` +
                         `3. Крылья вверху (пик взмаха)\n` +
                         `4. Крылья назад и вниз\n` +
                         `5. Снова внизу (завершение цикла)\n\n` +
                         `💡 *Профессиональный совет:*\n` +
                         `- Сделай движение плавным и цикличным\n` +
                         `- Добавь небольшую амплитуду тела\n\n` +
                         `Ты справишься! 🕊️`;
      
      bot.sendMessage(chatId, lesson3Text, mainMenu);
      break;

    case '📚 Примеры':
      const examplesText = `📚 **ПРИМЕРЫ АНИМАЦИЙ**\n\n` +
                         `*Основные принципы:*\n\n` +
                         `🎾 *Прыгающий шарик:*\n` +
                         `- Сжатие и растяжение\n` +
                         `- Ускорение и замедление\n` +
                         `- Дуговое движение\n\n` +
                         `🏃‍♂️ *Бегущий человечек:*\n` +
                         `- Циклическое движение\n` +
                         `- Противофазность рук и ног\n` +
                         `- Вес и баланс\n\n` +
                         `🕊️ *Летающая птица:*\n` +
                         `- Волнообразное движение\n` +
                         `- Плавные переходы\n` +
                         `- Аэродинамика\n\n` +
                         `Выбирай урок и начинай творить! ✨`;
      
      bot.sendMessage(chatId, examplesText, mainMenu);
      break;

    case '⭐ Мой прогресс':
      const progress = userProgress[chatId];
      const completed = progress.lessonsCompleted.length;
      
      let progressText = `⭐ **Твой прогресс, ${userName}:**\n\n` +
                         `✅ Пройдено уроков: ${completed}/3\n\n`;
      
      if (completed === 0) {
        progressText += `Начни с урока 1 - это основа основ! 🚀`;
      } else if (completed === 1) {
        progressText += `Отлично! Освоил сжатие и растяжение! 💪`;
      } else if (completed === 2) {
        progressText += `Супер! Переходи к плавной анимации! 🌟`;
      } else {
        progressText += `Потрясающе! Ты освоил основы анимации! 🏆`;
      }
      
      bot.sendMessage(chatId, progressText, mainMenu);
      break;

    case '❓ Помощь':
      const helpText = `❓ **ПОМОЩЬ**\n\n` +
                       `*Как работать с ботом:*\n\n` +
                       `🎓 *Начать урок* - выбери урок и следуй инструкциям\n` +
                       `📚 *Примеры* - изучи принципы анимации\n` +
                       `⭐ *Прогресс* - отслеживай свои успехи\n\n` +
                       `*Советы для начинающих:*\n` +
                       `- Начинай с простых форм\n` +
                       `- Рисуй кадры на отдельных листах\n` +
                       `- Снимай на телефон и смотри результат\n\n` +
                       `Удачи в творчестве! 🤗`;
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
    response = `Отлично, ${userName}! Ты освоил принцип сжатия и растяжения! 🎾\n\n` +
               `Это основа всей анимации - теперь ты понимаешь, как оживлять объекты!\n\n` +
               `✅ **Урок 1 завершен!**\n\n` +
               `Переходи к анимации персонажей! 🚀`;
  }
  else if (progress.currentLesson === 'lesson2' && !progress.lessonsCompleted.includes(2)) {
    progress.lessonsCompleted.push(2);
    response = `Потрясающе, ${userName}! Ты анимировал движение персонажа! 🏃‍♂️\n\n` +
               `Циклическая анимация - ключ к реалистичным движениям!\n\n` +
               `✅ **Урок 2 завершен!**\n\n` +
               `Так держать! Остался последний урок! 💪`;
  }
  else if (progress.currentLesson === 'lesson3' && !progress.lessonsCompleted.includes(3)) {
    progress.lessonsCompleted.push(3);
    response = `Восхитительно, ${userName}! Ты создал плавную анимацию полета! 🕊️\n\n` +
               `Волнообразные движения - высший пилотаж в анимации!\n\n` +
               `✅ **Урок 3 завершен!**\n\n` +
               `🎉 **ПОЗДРАВЛЯЮ!** Ты освоил основы анимации! 🏆`;
  }
  else {
    response = `Крутой рисунок, ${userName}! 🎨\n\n` +
               `Продолжай практиковаться - у тебя отлично получается! ✨`;
  }
  
  bot.sendMessage(chatId, response, mainMenu);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Бот запущен на порту ${PORT}`);
});
