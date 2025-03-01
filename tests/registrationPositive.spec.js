import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { RegistrationPage } from '../pages/registrationPagePositive.js';

dotenv.config();

test.describe('Registration Form - Full Validation', () => {
  let registrationPage;
  let page;
  let context;

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext(); // Створення нового контексту
    page = await context.newPage(); // Створення нової сторінки
  
    // Завантаження сторінки з використанням змінних з .env
    await page.goto(`https://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.BASE_URL}`, { waitUntil: 'load', timeout: 20000 });
  
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
    await registrationPage.openRegistrationForm(); // Відкриття форми реєстрації
  });
  

  test('should validate required fields', async () => {
    await registrationPage.checkRequiredField(registrationPage.nameField, 'Name is required');
    await registrationPage.checkRequiredField(registrationPage.lastNameField, 'Last name is required');
    await registrationPage.checkRequiredField(registrationPage.emailField, 'Email required');
    await registrationPage.checkRequiredField(registrationPage.passwordField, 'Password required');
    await registrationPage.checkRequiredField(registrationPage.repeatPasswordField, 'Re-enter password required');
  });

  test('should enable the Register button when all data is valid', async () => {
    await registrationPage.fillRegistrationForm('ValidName', 'ValidLastName', 'aqa-valid@example.com', 'Password1');
    await expect(registrationPage.registerButton).toBeEnabled();
  });

  test.afterEach(async () => {
    await page.close(); // Закриваємо сторінку після кожного тесту
    await context.close(); // Закриваємо контекст після кожного тесту
  });
});
