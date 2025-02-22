const { defineConfig, devices } = require('@playwright/test');
//const dotenv = require('dotenv');

// Завантажуємо змінні середовища з файлу .env
//dotenv.config();

module.exports = defineConfig({
  testDir: './tests', // Вказуємо директорію з тестами
  fullyParallel: true, // Запускати тести в файлах паралельно
  //forbidOnly: !!process.env.CI, // За замовчуванням забороняємо використання test.only на CI
  //retries: process.env.CI ? 2 : 0, // Скільки разів повторювати тести в CI
  //workers: process.env.CI ? 1 : undefined, // Визначаємо кількість воркерів на CI
  reporter: 'html', // Використовуємо HTML-репортер
  use: {
    headless: true, // Запуск у headless режимі
    screenshot: 'only-on-failure', // Знімки екрана лише при невдачі
    //baseURL: process.env.BASE_URL, // Базовий URL з .env
    trace: 'on-first-retry', // Збираємо трасування лише при першій невдачі
  },
  projects: [
    {
      name: 'chromium', // Тестування в браузері Chromium
      use: { ...devices['Desktop Chrome'] }, // Використовуємо десктопну версію Chrome
    },
  ],
});
