import { test, expect } from '@playwright/test';

test.describe('Admin portal', () => {
  test('requires the correct passkey to unlock leads', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByText('LESEKESE Admin Login')).toBeVisible();

    // Wrong passkey must NOT authenticate
    await page.getByPlaceholder(/Enter admin/i).fill('wrong-password');
    await page.getByRole('button', { name: /Login to Dashboard/i }).click();
    await expect(page.getByText('LESEKESE Admin Login')).toBeVisible();

    // Correct passkey unlocks the dashboard
    await page.getByPlaceholder(/Enter admin/i).fill('lesekese2026');
    await page.getByRole('button', { name: /Login to Dashboard/i }).click();
    await expect(page.getByText(/Total Leads Received/i)).toBeVisible();
  });

  test('shows lead table and status filter', async ({ page }) => {
    await page.goto('/admin');
    await page.getByPlaceholder(/Enter admin/i).fill('lesekese2026');
    await page.getByRole('button', { name: /Login to Dashboard/i }).click();

    await expect(page.getByRole('table')).toBeVisible();
    await page.getByRole('button', { name: 'New' }).click();
    await expect(page.locator('table')).toBeVisible();
  });
});