const { getRandomPraise } = require('../utils/keyboard');
const { MESSAGES } = require('../config/constants');

module.exports = {
  name: "Прыгающий шарик",
  description: "Научись основам анимации через простое движение",
  
  getContent: (userName) => {
    const praise = getRandomPraise(MESSAGES.PRAISE);
    
    return {
      text: `${userName}, давай создадим твою первую анимацию! 🎯\n\n` +
            `📝 **Урок 1: Прыгающий шарик**\n\n` +
            `🎯 **Задание:** Нарисуй 3 кадра прыгающего шарика:\n` +
            `1. Шарик вверху (сжатый)\n` +
            `2. Шарик внизу (растянутый)\n` +
            `3. Шарик снова вверху\n\n` +
            `💡 **Совет:** Используй простые формы и помни - при движении вниз шарик растягивается, а вверх - сжимается!\n\n` +
            `${praise}\n\n` +
            `Присылай свои кадры - помогу советом! 🎨`,
      options: {
        parse_mode: 'Markdown'
      }
    };
  }
};
