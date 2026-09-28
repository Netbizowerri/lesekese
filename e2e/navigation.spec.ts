import { test, expect } from '@playwright/test';

const ROUTES = [
  { path: '/', heading: /TOUGHER THAN PESTS/i },
  { path: '/products', heading: /ONE 500ML SIZE/i },
  { path: '/how-it-works', heading: /HOW LESEKESE ERADICATES PESTS/i },
  { path: '/locations', heading: /FIND LESEKESE NEAR YOU/i },
  { path: '/contact', heading: /CONTACT & BULK ORDER INQUIRIES/i },
  // Unconfigured Supabase renders the empty state instead of the index grid.
  // The page queries Supabase, so allow for a cold network round trip.
  { path: '/blog', heading: /Pest control, done right|No posts published yet/i, timeout: 20_000 },
  { path: '/privacy', heading: /PRIVACY POLICY/i },
  { path: '/terms', heading: /TERMS OF SERVICE/i },
  { path: '/safety', heading: /MATERIAL SAFETY DATA SHEET/i },
  { path: '/refunds', heading: /REFUND & DELIVERY POLICY/i }
];

test.describe('Public route navigation (direct load)', () => {
  for (const { path, heading, timeout } of ROUTES) {
    test(`${path} loads and shows its primary heading`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('h1, h2').filter({ hasText: heading }).first()).toBeVisible({
        timeout,
      });
      await expect(page).not.toHaveTitle('');
    });
  }
});

test.describe('Client-side navigation via navbar', () => {
  test('clicking navbar links updates the URL without a full reload', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /Products/i }).first().click();
    await expect(page).toHaveURL(/\/products$/);
    await expect(page.locator('h1').filter({ hasText: /ONE 500ML SIZE/i })).toBeVisible();

    await page.getByRole('button', { name: /How It Works/i }).first().click();
    await expect(page).toHaveURL(/\/how-it-works$/);
    await expect(page.locator('h1').filter({ hasText: /HOW LESEKESE ERADICATES/i })).toBeVisible();

    await page.getByRole('button', { name: /Distributor Locator/i }).first().click();
    await expect(page).toHaveURL(/\/locations$/);
    await expect(page.locator('h1').filter({ hasText: /FIND LESEKESE NEAR YOU/i })).toBeVisible();

    await page.getByRole('button', { name: /Contact & Orders/i }).first().click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.locator('h1').filter({ hasText: /CONTACT & BULK/i })).toBeVisible();

    // Back to home via logo
    await page.getByRole('button', { name: /LESEKESE Logo/i }).first().click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/TOUGHER THAN PESTS/i);
  });

  test('unknown paths fall back to the home page', async ({ page }) => {
    await page.goto('/does-not-exist');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/TOUGHER THAN PESTS/i);
    await expect(page).toHaveURL(/\/does-not-exist$/);
  });
});

test.describe('Footer navigation', () => {
  test('legal pages are reachable from the footer', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await footer.getByText(/Privacy Policy/i).click();
    await expect(page).toHaveURL(/\/privacy$/);
    await expect(page.locator('h1').filter({ hasText: /PRIVACY POLICY/i })).toBeVisible();
  });
});