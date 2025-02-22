const { test, expect } = require('@playwright/test');

test.describe('Basic Auth Test with Registration Form - Full Validation', () => {
  test.beforeEach(async ({ page }) => {
    const username = 'guest';
    const password = 'welcome2qauto';
    const url = `https://${username}:${password}@qauto.forstudy.space/`;

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Переконуємося, що header видно на сторінці
    await expect(page.locator('header')).toBeVisible();

    // Клікаємо на кнопку "Sign up"
    await page.locator('.hero-descriptor_btn').click();

    // Чекаємо появи модального вікна
    await expect(page.locator('.modal-body')).toBeVisible();
  });

  // Функція перевірки обов'язкових полів (тепер приймає page)
  async function checkRequiredField(page, selector, errorMessage) {
    await page.locator(selector).click();
    await page.locator('.modal-body').click(); // Клік поза полем для втрати фокусу
    await expect(page.locator(`${selector} ~ .invalid-feedback`)).toHaveText(errorMessage);
    
    const borderColor = await page.locator(selector).evaluate(el => window.getComputedStyle(el).borderColor);
    expect(borderColor).toBe('rgb(220, 53, 69)');
  }

//   test('should validate required fields only after losing focus', async ({ page }) => {
//     await checkRequiredField(page, '#signupName', 'Name required');
//     await checkRequiredField(page, '#signupLastName', 'Last name required');
//     await checkRequiredField(page, '#signupEmail', 'Email required');
//     await checkRequiredField(page, '#signupPassword', 'Password required');
//     await checkRequiredField(page, '#signupRepeatPassword', 'Re-enter password required');
//   });

  test('should enable the Register button when all data is valid', async ({ page }) => {
    // Вводимо валідні дані у поля
    await page.locator('#signupName').fill('ValidName');
    await page.locator('#signupLastName').fill('ValidLastName');
    await page.locator('#signupEmail').fill('validemail@example.com');
    await page.locator('#signupPassword').fill('Password1');
    await page.locator('#signupRepeatPassword').fill('Password1');

    // Перевіряємо, що кнопка реєстрації активна
    await expect(page.locator('.modal-footer > .btn')).toBeEnabled();
  });
});
