import { test, expect } from '@playwright/test';

test.describe('Distributor locator', () => {
  test('filters store cards by search query', async ({ page }) => {
    await page.goto('/locations');

    const search = page.getByPlaceholder(/Search area/i);
    await search.fill('Fagba');
    await expect(page.getByText(/Fagba/i).first()).toBeVisible();

    // Non-matching query shows the empty state
    await search.fill('zzzz-not-a-place');
    await expect(page.getByText(/No store found matching your search query/i)).toBeVisible();
  });

  test('filters stores by zone chip', async ({ page }) => {
    await page.goto('/locations');

    // First match is the zone chip (it renders above the store list)
    await page.getByRole('button', { name: 'Abuja', exact: true }).first().click();

    // Every visible store card should be in the Abuja zone
    const abujaCard = page.locator('h4').filter({ hasText: /Abuja/i }).first();
    await expect(abujaCard).toBeVisible();
    await expect(page.getByText(/No store found/i)).toHaveCount(0);
  });
});