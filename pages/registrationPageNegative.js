import { expect } from '@playwright/test';

export class RegistrationPageNegative {
    constructor(page) {
        this.page = page;
        this.signUpButton = page.locator('.hero-descriptor_btn');
        this.modalBody = page.locator('.modal-body');
        this.nameField = page.locator('#signupName');
        this.lastNameField = page.locator('#signupLastName');
        this.emailField = page.locator('#signupEmail');
        this.passwordField = page.locator('#signupPassword');
        this.repeatPasswordField = page.locator('#signupRepeatPassword');
        this.registerButton = page.locator('.modal-footer .btn-primary');
    }

    async openRegistrationForm() {
        await this.page.goto('/', { waitUntil: 'domcontentloaded' }); // Використовує baseURL
        await expect(this.page.locator('header')).toBeVisible();
        await this.signUpButton.click();
        await expect(this.modalBody).toBeVisible();
    }

    async checkRequiredField(field, errorMessage) {
        await field.click();
        await this.modalBody.click(); // Втрата фокусу
        const errorElement = field.locator('~ .invalid-feedback');
        await expect(errorElement).toBeVisible();
        await expect(errorElement).toHaveText(errorMessage);
        await expect(this.registerButton).toBeDisabled();
    }

    async fillField(field, value) {
        await field.fill(value);
        await this.modalBody.click();
    }
}
