import { expect } from '@playwright/test';

export class RegistrationPage {
  constructor(page) {
    this.page = page;
    // Локатори
    this.signUpButton = page.locator('button.hero-descriptor_btn.btn.btn-primary');
    this.modalBody = page.locator('.modal-body');
    this.nameField = page.locator('#signupName');
    this.lastNameField = page.locator('#signupLastName');
    this.emailField = page.locator('#signupEmail');
    this.passwordField = page.locator('#signupPassword');
    this.repeatPasswordField = page.locator('#signupRepeatPassword');
    this.registerButton = page.locator('.modal-footer > .btn-primary');
  }

  async openRegistrationForm() {
    const fullUrl = `https://${process.env.QAUTO_BASE_URL}`;
    await this.page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });

    await this.signUpButton.click();
    await expect(this.modalBody).toBeVisible({ timeout: 5000 });

    // Перевірка, що всі поля відображаються
    await expect(this.nameField).toBeVisible();
    await expect(this.lastNameField).toBeVisible();
    await expect(this.emailField).toBeVisible();
    await expect(this.passwordField).toBeVisible();
    await expect(this.repeatPasswordField).toBeVisible();

    // Перевірка обов’язкових полів
    await this.checkRequiredField(this.nameField, 'Name required');
    await this.checkRequiredField(this.lastNameField, 'Last name required');
    await this.checkRequiredField(this.emailField, 'Email required');
    await this.checkRequiredField(this.passwordField, 'Password required');
    await this.checkRequiredField(this.repeatPasswordField, 'Re-enter password required');
  }
  
    // Перевірка необхідних полів форми
  async checkRequiredField(field, errorMessage) {
    await field.click();  // Кликаємо по полю, щоб активувати його
    await this.modalBody.click();  // Кликаємо поза полем, щоб зняти фокус

    // Чекаємо, поки з'явиться елемент з повідомленням про помилку
    const errorElement = field.locator('~ .invalid-feedback');
    await expect(errorElement).toBeVisible();  // Перевіряємо, чи елемент з помилкою видимий
    await expect(errorElement).toHaveText(errorMessage);  // Перевіряємо, чи текст відповідає очікуваному

    // Перевіряємо колір обводки поля з допуском на похибку
    // Перевіряємо, чи колір обводки поля червоний (не вказуємо точний відтінок)
    const borderColor = await field.evaluate(el => window.getComputedStyle(el).borderColor);

    // Перевіряємо, чи колір є червоним
    expect(isRedColor(borderColor)).toBe(true); 
  }

    // Метод для заповнення форми реєстрації
  async fillRegistrationForm(name, lastName, email, password) {
    await this.nameField.fill(name);
    await this.lastNameField.fill(lastName);
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.repeatPasswordField.fill(password);
  }

  async submitRegistrationForm() {
    await expect(this.registerButton).toBeEnabled();
  }

}

// Функція для перевірки, чи є колір червоним
function isRedColor(color) {
  const [r, g, b] = color.match(/\d+/g).map(Number);
  return r > g && r > b;  // Перевірка, що червоний компонент найбільший
}

