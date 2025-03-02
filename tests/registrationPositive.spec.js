import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { RegistrationPage } from '../pages/registrationPagePositive.js';

dotenv.config({ path: './.env' }); // Явно вказуємо шлях до .env

test.describe('Registration Form - Full Validation', () => {
  let registrationPage;
  let page;
  let context;

  test.beforeEach(async ({ browser }) => { 
    test.setTimeout(60000);  // Збільшення тайм-ауту тесту до 60 секунд
    context = await browser.newContext(); // Створення нового контексту
    page = await context.newPage(); // Створення нової сторінки

    // Завантаження сторінки з використанням змінних з .env
    await page.goto(`https://${process.env.QAUTO_USERNAME}:${process.env.QAUTO_PASSWORD}@${process.env.QAUTO_BASE_URL}`, { waitUntil: 'load', timeout: 20000 });

    // Перевірка на наявність header
    const header = page.locator('header');
    const isHeaderVisible = await header.isVisible();
    if (isHeaderVisible) {
      console.log('Header is visible!');
    } else {
      console.log('Header is not visible!');
    }
  
    // Чекаємо, поки кнопка "Sign up" стане видимою
    const signUpButton = page.locator('.hero-descriptor .hero-descriptor_btn');
    await expect(signUpButton).toBeVisible({ timeout: 10000 }); 
    await signUpButton.click(); // Клік по кнопці
  
    // Перевірка, що модальне вікно відкрилося
    await expect(page.locator('.modal-body')).toBeVisible({ timeout: 10000 });

    registrationPage = new RegistrationPage(page); // ініціалізація сторінки реєстрації
  });

  test('should validate required fields', async () => {
    await registrationPage.openRegistrationForm('ValidName', 'ValidLastName', 'aqa-valid@example.com', 'Password1'); // Відкриття форми реєстрації
    
    // Перевірка полів на обов'язковість
    await registrationPage.checkRequiredField(registrationPage.nameField, 'Name required');
    await registrationPage.checkRequiredField(registrationPage.lastNameField, 'Last name required');
    await registrationPage.checkRequiredField(registrationPage.emailField, 'Email required');
    await registrationPage.checkRequiredField(registrationPage.passwordField, 'Password required');
    await registrationPage.checkRequiredField(registrationPage.repeatPasswordField, 'Re-enter password required');
  });

  test('should enable the Register button when all data is valid', async () => {
    await registrationPage.openRegistrationForm('ValidName', 'ValidLastName', 'aqa-valid@example.com', 'Password1'); // Відкриття форми реєстрації
    
    // Заповнюємо форму
    await registrationPage.fillRegistrationForm('ValidName', 'ValidLastName', 'aqa-valid@example.com', 'Password1');

    // Тепер перевіряємо, чи кнопка Register стала активною
    const registerButton = page.locator('.modal-footer > .btn-primary');
    
    // Додано перевірку на видимість кнопки перед активацією
    const isRegisterButtonVisible = await registerButton.isVisible();
    console.log('Register Button Visible:', isRegisterButtonVisible);
    
    await expect(registerButton).toBeEnabled();
  });

  test.afterEach(async () => {
    console.log('Closing page and context...');
    await page.close(); // Закриваємо сторінку після кожного тесту
    await context.close(); // Закриваємо контекст після кожного тесту
  });
});
