import { test as base } from '@playwright/test';
import { GaragePage } from '../pages/garagePage';

export const test = base.extend({
  userGaragePage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: 'storageState.json' });
    const page = await context.newPage();
    const garagePage = new GaragePage(page);
    await use(garagePage);
    await context.close();
  },
});
