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
    const baseUrl = this.page.context()._options.baseURL; // Використовуємо Playwright конфіг
    await this.page.goto(`${baseUrl}`, { waitUntil: 'domcontentloaded', timeout: 10000 });

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

  async checkRequiredField(field, errorMessage) {
    await field.click();  
    await this.modalBody.click();  

    const errorElement = field.locator('~ .invalid-feedback');
    await expect(errorElement).toBeVisible();  
    await expect(errorElement).toHaveText(errorMessage);  
  }

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
