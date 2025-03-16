import { expect } from '@playwright/test';

export class GaragePage {
  constructor(page) {
    this.page = page;
    this.garageHeader = page.locator('h1'); // Оновлений локатор для заголовка "Garage"
  }

  async open() {
    await this.page.goto('/panel/garage');
  }

  async verifyGaragePage() {
    await expect(this.garageHeader).toHaveText('Garage'); // Оновлена перевірка
  }
}
