const { chromium, expect } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const username = 'guest';
  const password = 'welcome2qauto';
  const url = `https://${username}:${password}@qauto.forstudy.space/`;

  console.log('➡️ Відкриваємо сторінку з авторизацією...');
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  console.log('✅ Переконуємося, що header видно...');
  await expect(page.locator('header')).toBeVisible();

  console.log('➡️ Клікаємо на кнопку "Sign In"...');
  await page.locator('.btn.btn-outline-white.header_signin').click();

  console.log('✅ Чекаємо появи модального вікна...');
  await expect(page.locator('.modal-body')).toBeVisible();

  console.log('➡️ Виконуємо логін через модальне вікно...');
  await page.locator('#signinEmail').fill('test1@example.com');
  await page.locator('#signinPassword').fill('Test1234');
  await page.locator('.btn.btn-primary:has-text("Login")').click();

  console.log('✅ Очікуємо на перехід до Garage...');
  await page.waitForURL('**/garage', { timeout: 5000 });

  console.log('✅ Перевіряємо, чи користувач у гаражі...');
  await expect(page.locator('h1:has-text("Garage")')).toBeVisible();

  console.log('➡️ Зберігаємо стан авторизації у storageState.json...');
  await context.storageState({ path: 'storageState.json' });

  // Перевірка, чи файл створився
  if (fs.existsSync('storageState.json')) {
    console.log('✅ storageState.json успішно створений!');
  } else {
    console.log('❌ ПОМИЛКА: storageState.json не створено!');
  }

  await browser.close();
})();
