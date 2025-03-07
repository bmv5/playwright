import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/registrationPagePositive.js';

test.describe('Registration Form - Full Validation', () => {
  let registrationPage;
  let page;
  let context;

  test.beforeEach(async ({ browser, baseURL }) => { 
    test.setTimeout(60000); // Збільшення тайм-ауту до 60 секунд
    context = await browser.newContext(); // Створюємо новий контекст
    page = await context.newPage(); // Створюємо нову сторінку

    // Завантаження сторінки через baseURL із Playwright конфігу
    await page.goto(baseURL, { waitUntil: 'load', timeout: 20000 });

    // Перевіряємо наявність header
    const header = page.locator('header');
    if (await header.isVisible()) {
      console.log('Header is visible!');
    } else {
      console.log('Header is not visible!');
    }

    // Очікуємо кнопку "Sign up" і клікаємо
    const signUpButton = page.locator('.hero-descriptor .hero-descriptor_btn');
    await expect(signUpButton).toBeVisible({ timeout: 10000 });
    await signUpButton.click();

    // Перевіряємо, що модальне вікно відкрилося
    await expect(page.locator('.modal-body')).toBeVisible({ timeout: 10000 });

    registrationPage = new RegistrationPage(page); // ініціалізація сторінки реєстрації
  });

  test('should validate required fields', async () => {
    await registrationPage.openRegistrationForm();

    // Перевірка обов'язкових полів
    await registrationPage.checkRequiredField(registrationPage.nameField, 'Name required');
    await registrationPage.checkRequiredField(registrationPage.lastNameField, 'Last name required');
    await registrationPage.checkRequiredField(registrationPage.emailField, 'Email required');
    await registrationPage.checkRequiredField(registrationPage.passwordField, 'Password required');
    await registrationPage.checkRequiredField(registrationPage.repeatPasswordField, 'Re-enter password required');
  });

  test('should enable the Register button when all data is valid', async () => {
    await registrationPage.openRegistrationForm();

    // Заповнюємо форму
    await registrationPage.fillRegistrationForm('ValidName', 'ValidLastName', 'aqa-valid@example.com', 'Password1');

    // Перевіряємо, що кнопка Register стала активною
    const registerButton = page.locator('.modal-footer > .btn-primary');
    await expect(registerButton).toBeEnabled();
  });

  test.afterEach(async () => {
    console.log('Closing page and context...');
    await page.close(); // Закриваємо сторінку
    await context.close(); // Закриваємо контекст
  });
});
