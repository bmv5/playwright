import { test, expect } from '@playwright/test';

test.describe('Negative tests', () => {
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

    // Функція перевірки обов'язкових полів
    async function checkRequiredField(page, selector, errorMessage) {
        await page.locator(selector).click();
        await page.locator('.modal-body').click(); // Клік поза полем для втрати фокусу
        await expect(page.locator(`${selector} ~ .invalid-feedback`)).toHaveText(errorMessage);
        
        // Переконуємося, що кнопка Register залишається disabled
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    }

    test('Empty Name field', async ({ page }) => {
        await checkRequiredField(page, '#signupName', 'Name required');
    });

    test('Invalid Name (only spaces)', async ({ page }) => {
        await page.fill('#signupName', '   ');
        await page.locator('.modal-body').click();
        await expect(page.locator('#signupName + .invalid-feedback')).toHaveText('Name is invalid');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    });

    test('Name field with Cyrillic input', async ({ page }) => {
        // Вводимо слово кирилицею
        await page.fill('#signupName', 'Іван');
        // Явно втрачаємо фокус на полі, щоб Angular обробив зміни
        await page.locator('#signupName').blur();
        // Перевіряємо, чи поле отримало клас ng-invalid та ng-touched
        await expect(page.locator('#signupName')).toHaveClass(/ng-invalid/);
        await expect(page.locator('#signupName')).toHaveClass(/ng-touched/);
        // Перевіряємо, чи з'явилось повідомлення про помилку (якщо є)
        await expect(page.locator('#signupName ~ .invalid-feedback')).toHaveText('Name is invalid');
        // Перевіряємо, чи кнопка реєстрації залишатиметься заблокованою
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    });
    

    test('Short Name (1 character)', async ({ page }) => {
        await page.fill('#signupName', 'J');
        await page.locator('.modal-body').click();
        await expect(page.locator('#signupName + .invalid-feedback')).toHaveText('Name has to be from 2 to 20 characters long');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    });

    test('Short Name (21 character)', async ({ page }) => {
        await page.fill('#signupName', 'ABCDEFGHIJKLMNOPRSTQR');
        await page.locator('.modal-body').click();
        await expect(page.locator('#signupName + .invalid-feedback')).toHaveText('Name has to be from 2 to 20 characters long');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    });

    test('Empty Last name field', async ({ page }) => {
        await checkRequiredField(page, '#signupLastName', 'Last name required');
    });

    test('Invalid Last name (only spaces)', async ({ page }) => {
        await page.fill('#signupLastName', '   ');
        await page.locator('.modal-body').click();
        await expect(page.locator('#signupLastName + .invalid-feedback')).toHaveText('Last name is invalid');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    });

    test('Last name field with Cyrillic input', async ({ page }) => {
        // Вводимо слово кирилицею
        await page.fill('#signupLastName', 'Завернигора');
        // Явно втрачаємо фокус на полі, щоб Angular обробив зміни
        await page.locator('#signupLastName').blur();
        // Перевіряємо, чи поле отримало клас ng-invalid та ng-touched
        await expect(page.locator('#signupLastName')).toHaveClass(/ng-invalid/);
        await expect(page.locator('#signupLastName')).toHaveClass(/ng-touched/);
        // Перевіряємо, чи з'явилось повідомлення про помилку (якщо є)
        await expect(page.locator('#signupLastName ~ .invalid-feedback')).toHaveText('Last name is invalid');
        // Перевіряємо, чи кнопка реєстрації залишатиметься заблокованою
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    });

    test('Short Last name (1 character)', async ({ page }) => {
        await page.fill('#signupLastName', 'A');
        await page.locator('.modal-body').click();
        await expect(page.locator('#signupLastName + .invalid-feedback')).toHaveText('Last name has to be from 2 to 20 characters long');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    });

    
    test('Short Last name (21 character)', async ({ page }) => {
        await page.fill('#signupLastName', 'ABCDEFGHIJKLMNOPRSTQR');
        await page.locator('.modal-body').click();
        await expect(page.locator('#signupLastName + .invalid-feedback')).toHaveText('Last name has to be from 2 to 20 characters long');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    });

    test('Invalid Email format', async ({ page }) => {
        // Заповнюємо поле з некоректним імейлом
        await page.fill('#signupEmail', 'invalid_email');
        
        // Явно втрачаємо фокус, щоб додати клас ng-touched
        await page.locator('#signupEmail').blur();
        
        // Перевіряємо, чи додався клас ng-invalid та ng-touched
        await expect(page.locator('#signupEmail')).toHaveClass(/ng-invalid/);
        await expect(page.locator('#signupEmail')).toHaveClass(/ng-touched/);
    
        // Перевіряємо, чи є повідомлення про помилку
        const errorLocator = page.locator('#signupEmail ~ .invalid-feedback');
        await expect(errorLocator).toBeVisible({ timeout: 7000 });
        await expect(errorLocator).toHaveText('Email is incorrect');
        
        // Перевіряємо, що кнопка реєстрації залишатиметься заблокованою
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    });
    
    
    

    test('Mismatched Passwords', async ({ page }) => {
        await page.fill('#signupPassword', 'Test1234');
        await page.fill('#signupRepeatPassword', 'WrongPass1');
        await page.locator('.modal-body').click();
        await expect(page.locator('#signupRepeatPassword + .invalid-feedback')).toHaveText('Passwords do not match');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    });

    test('Invalid Password (no numbers)', async ({ page }) => {
        await page.fill('#signupPassword', 'TestTest');
        await page.locator('.modal-body').click();
        await expect(page.locator('#signupPassword + .invalid-feedback')).toHaveText(
            'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
        );
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    });

});
