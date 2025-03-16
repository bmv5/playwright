import { test } from './fixtures';

test('User should see correct heading on garage page', async ({ userGaragePage }) => {
  await userGaragePage.open();
  await userGaragePage.verifyGaragePage(); // Використовуємо оновлений метод
});


