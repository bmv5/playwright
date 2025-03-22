import { test, expect } from '@playwright/test';

test.use({ storageState: 'storageState.json' });

test('Profile page - mock API response', async ({ page }) => {
  // Логуємо всі запити та відповіді
  page.on('request', (request) => {
    console.log(`➡️ [REQUEST] ${request.method()} ${request.url()}`);
  });
  page.on('response', async (response) => {
    console.log(`✅ [RESPONSE] ${response.status()} ${response.url()}`);
  });

  // ✅ Перехоплення API `/api/users/profile`
  await page.route('**/api/users/profile', async (route) => {
    console.log('⚡ [MOCK] Перехоплено /api/users/profile');
    await route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      json: {
        status: "ok",
        data: {
          userId: 123,
          photoFilename: "default-user.png",
          name: "John",
          lastName: "Doe"
        }
      }
    });
  });

  // ✅ Переходимо в Garage
  console.log('➡️ Переходимо в Garage...');
  await page.goto('https://qauto.forstudy.space/panel/garage', { waitUntil: 'networkidle', timeout: 10000 });

  // ✅ Очищуємо кеш і перезавантажуємо сторінку
  console.log('🔄 Перезавантажуємо сторінку для оновлення API-запиту...');
  await page.reload({ waitUntil: 'networkidle' });

  // ✅ Натискаємо "Profile"
  console.log('➡️ Клікаємо на "Profile"...');
  const profileButton = page.locator('.sidebar_btn.-profile');
  await profileButton.waitFor({ state: 'visible', timeout: 5000 });
  await profileButton.click();

  // ✅ Очікуємо зміну URL
  console.log('🔍 Очікуємо зміну URL...');
  await page.waitForURL('**/panel/profile', { timeout: 5000 });
  console.log('✅ URL змінено!');

  // ✅ Додаємо невелику затримку перед чекаєм на відповідь
  await page.waitForTimeout(500);  // Затримка 0.5 секунди перед виконанням очікування

  // ✅ Додаємо логування перед очікуванням відповіді
  const response = await page.waitForResponse((res) => {
    console.log(`🔎 Перевіряємо: ${res.url()} -> ${res.status()}`);
    return res.url().includes('/api/users/profile') && res.status() === 200;  // Правильний код статусу 200
  }, { timeout: 20000 });

  console.log('✅ Отримано відповідь від API:', await response.json());

  // ✅ Очікуємо оновлення UI
  console.log('🔍 Очікуємо появу імені...');
  const profileName = page.locator('.profile_name');
  await expect(profileName).toHaveText('John Doe', { timeout: 10000 });

  console.log(`✅ [SUCCESS] Ім'я оновилося!`);
});
