const { MENU_BUTTONS } = require('../config/constants');

module.exports = {
  // Основная клавиатура меню
  getMainMenu: () => {
    return {
      reply_markup: {
        keyboard: [
          [MENU_BUTTONS.START_LESSON],
          [MENU_BUTTONS.EXAMPLES, MENU_BUTTONS.PROGRESS],
          [MENU_BUTTONS.HELP]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      }
    };
  },

  // Клавиатура для выбора уроков
  getLessonsMenu: () => {
    return {
      reply_markup: {
        keyboard: [
          ['📝 Урок 1: Прыгающий шарик', '🎨 Урок 2: Бегущий человечек'],
          ['✨ Урок 3: Летающая птица', '🌟 Урок 4: Танцующее облако'],
          ['🔙 Назад в меню']
        ],
        resize_keyboard: true
      }
    };
  },

  // Случайная похвала
  getRandomPraise: (praises) => {
    return praises[Math.floor(Math.random() * praises.length)];
  }
};
