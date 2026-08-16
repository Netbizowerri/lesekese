import { test, expect } from '@playwright/test';

test.describe('Contact / inquiry form', () => {
  test('submits a valid inquiry and shows the success state', async ({ page }) => {
    // Intercept the Formspree POST so the test stays offline-safe
    await page.route('**/*formspree*/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
    );

    await page.goto('/contact');

    await page.getByPlaceholder('e.g. Chief Emeka Okonkwo').fill('Ada Obi');
    await page.getByPlaceholder('e.g. 08023725740').fill('08012345678');
    await page.getByPlaceholder('e.g. name@domain.com').fill('ada.obi@example.com');
    await page
      .getByPlaceholder('Describe your pest issue, quantity needed, or specific delivery address...')
      .fill('I need a carton of 500ml delivered to Abuja.');

    await page.getByRole('button', { name: /Submit Inquiry/i }).click();

    await expect(page.getByText('Inquiry Received Successfully!')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/ada\.obi@example\.com|08012345678/).first()).toBeVisible();
  });

  test('blocks submission until required fields are filled', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: /Submit Inquiry/i }).click();
    const invalidField = page.locator('input:invalid').first();
    await expect(invalidField).toBeVisible();
  });
});