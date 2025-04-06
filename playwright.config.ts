import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

// Завантажуємо змінні оточення з .env файлу
dotenv.config();

export default defineConfig({
  projects: [
    {
      name: 'prod',
      use: {
        baseURL: process.env.PROD_BASE_URL || 'https://qauto.forstudy.space',
        httpCredentials: {
          username: process.env.PROD_USERNAME || 'guest',
          password: process.env.PROD_PASSWORD || 'welcome2qauto',
        },
        trace: 'on', // Додає трасування до репорту
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'qa',
      use: {
        baseURL: process.env.QA_BASE_URL || 'https://qauto2.forstudy.space',
        httpCredentials: {
          username: process.env.QA_USERNAME || 'guest',
          password: process.env.QA_PASSWORD || 'welcome2qauto',
        },
        trace: 'on',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
  ],
  reporter: [
    ['list'],
    ['json', {  outputFile: 'test-results.json' }],
    ['dot'],
    ['allure-playwright'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]  // ⬅️ Додано для GitHub
  ],
});
