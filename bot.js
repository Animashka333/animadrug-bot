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

// ТВОИ КАРТИНКИ - теперь с правильными ссылками!
const LESSON_IMAGES = {
  lesson1: 'https://disk.yandex.ru/i/1Pfz0SOyUPfajQ', // картинка прыгающего шарика
  lesson1_gif: 'https://disk.yandex.ru/i/xX2FYj7nv5bR_Q'  // gif анимация шарика
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
      
      // Отправляем оба примера - картинку и гифку
      bot.sendMessage(chatId, `🎾 **УРОК 1: ПРЫГАЮЩИЙ ШАРИК**\n\n*Смотри примеры анимации:*`)
        .then(() => {
          // Отправляем картинку
          return bot.sendPhoto(chatId, LESSON_IMAGES.lesson1, {
            caption: `📸 *Статичный пример* - кадры прыгающего шарика`
          }).catch(err => {
            console.log('Картинка не загрузилась, продолжаем без нее');
            return Promise.resolve();
          });
        })
        .then(() => {
          // Отправляем гифку
          return bot.sendAnimation(chatId, LESSON_IMAGES.lesson1_gif, {
            caption: `🎬 *Анимация* - движение в действии!`
          }).catch(err => {
            console.log('Гифка не загрузилась, продолжаем без нее');
            return Promise.resolve();
          });
        })
        .then(() => {
          // Отправляем задание
          const lesson1Text = `✨ *Принципы анимации:*\n\n` +
                           `📖 *Сжатие и растяжение:*\n` +
                           `- Шарик растягивается при падении\n` +
                           `- Сжимается при ударе о землю\n` +
                           `- Снова растягивается при отскоке\n\n` +
                           `🎯 *Твое задание:*\n` +
                           `Нарисуй 8 кадров прыгающего шарика:\n\n` +
                           `1. 🟢 Вверху (круглый)\n` +
                           `2. 🔻 Начинает падать\n` +
                           `3. ⬇️ Быстро летит вниз\n` +
                           `4. 💥 Удар о землю\n` +
                           `5. 🔺 Начинает отскакивать\n` +
                           `6. ⬆️ Быстро летит вверх\n` +
                           `7. 🟡 Замедляется\n` +
                           `8. 🟢 Снова вверху\n\n` +
                           `💡 *Совет:* Смотри на примеры выше и повтори движение!\n\n` +
                           `Присылай свои кадры! 🎨`;
          return bot.sendMessage(chatId, lesson1Text, mainMenu);
        })
        .catch(err => {
          console.log('Ошибка при отправке урока:', err);
          sendLesson1Text(chatId, userName);
        });
      break;

    case '🎨 Урок 2: Бегущий человечек':
      userProgress[chatId].currentLesson = 'lesson2';
      sendLesson2Text(chatId, userName);
      break;

    case '✨ Урок 3: Летающая птица':
      userProgress[chatId].currentLesson = 'lesson3';
      sendLesson3Text(chatId, userName);
      break;

    case '📚 Примеры':
      bot.sendMessage(chatId, `📚 **Примеры анимаций**\n\nСмотри, что ты научишься создавать!`)
        .then(() => {
          return bot.sendAnimation(chatId, LESSON_IMAGES.lesson1_gif, {
            caption: '🎾 Прыгающий шарик - основа анимации!'
          }).catch(err => {
            console.log('Гифка в примерах не загрузилась');
            return Promise.resolve();
          });
        })
        .then(() => {
          bot.sendMessage(chatId, 
            `*Другие примеры скоро появятся!*\n\nА пока выбирай урок 1 и начинай творить! ✨`, 
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
        progressText += `Начни с урока 1 - там уже есть примеры с картинками! 🚀`;
      } else if (completed === 1) {
        progressText += `Отлично! Ты освоил принцип сжатия и растяжения! 💪`;
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
                       `🎓 *Начать урок* - смотри примеры и выполняй задания\n` +
                       `📚 *Примеры* - изучай готовые анимации\n` +
                       `⭐ *Прогресс* - отслеживай свои успехи\n\n` +
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

// Функции для текстов уроков 2 и 3
function sendLesson2Text(chatId, userName) {
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
                     `Жду твои рисунки! 🏃‍♂️`;
  
  bot.sendMessage(chatId, lesson2Text, mainMenu);
}

function sendLesson3Text(chatId, userName) {
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
                     `Ты справишься! 🕊️`;
  
  bot.sendMessage(chatId, lesson3Text, mainMenu);
}

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
               `Это основа всей анимации!\n\n` +
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
