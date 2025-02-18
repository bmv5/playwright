const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Подавляет ошибки source map для системных протоколов
      on('task', {
        suppressErrorSourceMap: () => null,
      });
    },
  },
});