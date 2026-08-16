import { test, expect } from '@playwright/test';

// The Quick Checkout modal renders inside a full-screen fixed overlay.
const modalOverlay = (page: import('@playwright/test').Page) =>
  page.locator('.fixed.inset-0.z-50');

test.describe('Order / Quick Checkout flow', () => {
  test('opens the order modal from the home hero and adjusts quantity', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /Order Now \(Fast Dispatch\)/i }).click();

    const modal = modalOverlay(page);
    await expect(modal).toContainText('Quick Order / Instant Checkout');

    // Default: 500ml, qty 2, total = ₦3,000 * 2
    await expect(modal).toContainText('₦6,000');

    // Bump quantity
    await modal.getByRole('button', { name: '+' }).click();
    await expect(modal).toContainText('₦9,000');

    // WhatsApp checkout link is wired correctly
    const waLink = modal.locator('a[href^="https://wa.me/"]');
    await expect(waLink).toHaveAttribute('href', /wa\.me\/2348023725740/);
    await expect(waLink).toHaveAttribute('href', /3x/);

    // Call dispatch link
    await expect(modal.locator('a[href="tel:08023725740"]')).toBeVisible();

    // Close the modal
    await modal.locator('button').first().click();
    await expect(page.getByText('Quick Order / Instant Checkout')).toHaveCount(0, {
      timeout: 5_000
    });
  });

  test('opens the order modal from a product card', async ({ page }) => {
    await page.goto('/products');
    await page.getByRole('button', { name: /Order Now \/ Bulk Request/i }).first().click();
    await expect(modalOverlay(page)).toContainText('Quick Order / Instant Checkout');
  });

  test('switching bottle size updates the total', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Order Now \(Fast Dispatch\)/i }).click();

    const modal = modalOverlay(page);

    // Select 100ml -> ₦1,000 * 2 = ₦2,000
    await modal.getByRole('button', { name: /₦1,000/ }).click();
    await expect(modal).toContainText('₦2,000');
  });
});