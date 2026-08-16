import { test, expect, devices } from '@playwright/test';

test.describe('Mobile experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(devices['Pixel 5'].viewport);
  });

  test('hamburger menu opens navigation and navigates', async ({ page }) => {
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Toggle Menu' });
    await expect(toggle).toBeVisible();
    await toggle.click();

    const menu = page.getByRole('button', { name: /Products/i });
    await expect(menu).toBeVisible();
    await menu.click();

    await expect(page).toHaveURL(/\/products$/);
    await expect(page.locator('h1').filter({ hasText: /FAST-ACTING/i })).toBeVisible();
  });

  test('order shortcut opens the quick checkout modal', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Order', exact: true }).click();

    const modal = page.locator('.fixed.inset-0.z-50');
    await expect(modal).toContainText('Quick Order / Instant Checkout');
  });

  test('find store shortcut routes to the locator', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Toggle Menu' }).click();
    await page.getByRole('button', { name: 'Find Store' }).click();
    await expect(page).toHaveURL(/\/locations$/);
  });
});