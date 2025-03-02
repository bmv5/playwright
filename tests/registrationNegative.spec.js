import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { RegistrationPageNegative } from '../pages/registrationPageNegative.js';

dotenv.config({ path: './.env' }); // Явно вказуємо шлях до .env

test.describe('Negative tests', () => {
    let registrationPage;

    test.beforeEach(async ({ page }) => {
        registrationPage = new RegistrationPageNegative(page);
        await registrationPage.openRegistrationForm();
    });

    test('Empty Name field', async () => {
        await registrationPage.checkRequiredField(registrationPage.nameField, 'Name required');
    });

    test('Invalid Name (only spaces)', async () => {
        await registrationPage.fillField(registrationPage.nameField, '   ');
        await expect(registrationPage.nameField.locator('+ .invalid-feedback')).toHaveText('Name is invalid');
        await expect(registrationPage.registerButton).toBeDisabled();
    });

    test('Name field with Cyrillic input', async () => {
        await registrationPage.fillField(registrationPage.nameField, 'Іван');
        await registrationPage.nameField.blur();
        await expect(registrationPage.nameField).toHaveClass(/ng-invalid/);
        await expect(registrationPage.nameField).toHaveClass(/ng-touched/);
        await expect(registrationPage.nameField.locator('~ .invalid-feedback')).toHaveText('Name is invalid');
        await expect(registrationPage.registerButton).toBeDisabled();
    });

    test('Short Name (1 character)', async () => {
        await registrationPage.fillField(registrationPage.nameField, 'J');
        await expect(registrationPage.nameField.locator('+ .invalid-feedback')).toHaveText('Name has to be from 2 to 20 characters long');
        await expect(registrationPage.registerButton).toBeDisabled();
    });

    test('Long Name (21 characters)', async () => {
        await registrationPage.fillField(registrationPage.nameField, 'ABCDEFGHIJKLMNOPRSTQR');
        await registrationPage.modalBody.click();
        await expect(registrationPage.nameField.locator('+ .invalid-feedback')).toHaveText('Name has to be from 2 to 20 characters long');
        await expect(registrationPage.registerButton).toBeDisabled();
    });

    test('Invalid Last name (only spaces)', async () => {
        await registrationPage.fillField(registrationPage.lastNameField, '   ');
        await registrationPage.modalBody.click();
        await expect(registrationPage.lastNameField.locator('+ .invalid-feedback')).toHaveText('Last name is invalid');
        await expect(registrationPage.registerButton).toBeDisabled();
    });

    test('Empty Last name field', async () => {
        await registrationPage.checkRequiredField(registrationPage.lastNameField, 'Last name required');
    });

    test('Last name field with Cyrillic input', async () => {
        await registrationPage.fillField(registrationPage.lastNameField, 'Завернигора');
        await registrationPage.lastNameField.blur();
        await expect(registrationPage.lastNameField).toHaveClass(/ng-invalid/);
        await expect(registrationPage.lastNameField).toHaveClass(/ng-touched/);
        await expect(registrationPage.lastNameField.locator('~ .invalid-feedback')).toHaveText('Last name is invalid');
        await expect(registrationPage.registerButton).toBeDisabled();
    });
    
    test('Short Last name (1 character)', async () => {
        await registrationPage.fillField(registrationPage.lastNameField, 'A');
        await registrationPage.modalBody.click();
        await expect(registrationPage.lastNameField.locator('+ .invalid-feedback')).toHaveText('Last name has to be from 2 to 20 characters long');
        await expect(registrationPage.registerButton).toBeDisabled();
    });
    
    test('Long Last name (21 characters)', async () => {
        await registrationPage.fillField(registrationPage.lastNameField, 'ABCDEFGHIJKLMNOPRSTQR');
        await registrationPage.modalBody.click();
        await expect(registrationPage.lastNameField.locator('+ .invalid-feedback')).toHaveText('Last name has to be from 2 to 20 characters long');
        await expect(registrationPage.registerButton).toBeDisabled();
    });

    test('Invalid Email format', async () => {
        await registrationPage.fillField(registrationPage.emailField, 'invalid_email');
    
        // Явно втрачаємо фокус, щоб Angular оновив валідацію
        await registrationPage.emailField.blur();
    
        // Очікуємо, що поле стало невалідним
        await expect(registrationPage.emailField).toHaveClass(/ng-invalid/, { timeout: 7000 });
        await expect(registrationPage.emailField).toHaveClass(/ng-touched/);
    
        // Локатор повідомлення про помилку
        const errorLocator = registrationPage.emailField.locator('~ .invalid-feedback');
    
        // Очікуємо появу повідомлення про помилку
        await expect(errorLocator).toBeVisible({ timeout: 7000 });
        await expect(errorLocator).toHaveText(/Email is incorrect/i, { timeout: 7000 });
    
        // Переконуємося, що кнопка "Register" залишається неактивною
        await expect(registrationPage.registerButton).toBeDisabled();
    });
    

    test('Mismatched Passwords', async () => {
        await registrationPage.fillField(registrationPage.passwordField, 'Test1234');
        await registrationPage.fillField(registrationPage.repeatPasswordField, 'WrongPass1');
        await expect(registrationPage.repeatPasswordField.locator('+ .invalid-feedback')).toHaveText('Passwords do not match');
        await expect(registrationPage.registerButton).toBeDisabled();
    });

    test('Invalid Password (no numbers)', async () => {
        await registrationPage.fillField(registrationPage.passwordField, 'TestTest');
        await expect(registrationPage.passwordField.locator('+ .invalid-feedback')).toHaveText(
            'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
        );
        await expect(registrationPage.registerButton).toBeDisabled();
    });
});
