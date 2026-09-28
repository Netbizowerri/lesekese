import { test, expect } from '@playwright/test';

// The Quick Checkout modal renders inside a full-screen fixed overlay.
const modalOverlay = (page: import('@playwright/test').Page) =>
  page.locator('.fixed.inset-0.z-50');

const naira = (n: number) => `₦${n.toLocaleString('en-US')}`;

// Official retail tiers for the single 500ml SKU.
const STARTER = 10_000;
const FAMILY = 15_000;
const FULL_HOUSE = 20_000;
const LANDLORD = 25_000;

test.describe('Order / Quick Checkout flow', () => {
  test('opens the order modal from the home hero at the default Family pack', async ({ page, context }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /Order Family Pack/i }).click();

    const modal = modalOverlay(page);
    await expect(modal).toContainText('Quick Order / Instant Checkout');

    // Hero defaults to the Family tier: 2 x 500ml = ₦15,000
    await expect(modal).toContainText(naira(FAMILY));
    await expect(modal).toContainText(naira(STARTER));

    // WhatsApp checkout is a button now: it records the order to Supabase
    // (when configured) before handing off. Intercept the request so the
    // assertion covers exactly what the app generates, unaffected by
    // wa.me's redirect to api.whatsapp.com.
    const waButton = modal.getByRole('button', { name: /Instant WhatsApp Checkout/i });
    await expect(waButton).toBeVisible();

    // window.open creates a separate page, so intercept on the browser
    // context rather than the current page.
    let requested = '';
    await context.route('https://wa.me/**', (route) => {
      requested = route.request().url();
      return route.abort();
    });
    await waButton.click();
    await context.unroute('https://wa.me/**');

    expect(requested).toContain('wa.me/2348023725740');
    expect(decodeURIComponent(requested)).toContain('2 x Lesekese');

    // Call dispatch link
    await expect(modal.locator('a[href="tel:08023725740"]')).toBeVisible();

    // Close the modal
    await modal.getByRole('button', { name: /Close order dialog/i }).click();
    await expect(page.getByText('Quick Order / Instant Checkout')).toHaveCount(0, {
      timeout: 5_000
    });
  });

  test('opens the order modal from a product card', async ({ page }) => {
    await page.goto('/products');
    await page.getByRole('button', { name: /Order Now \/ Bulk Request/i }).first().click();
    await expect(modalOverlay(page)).toContainText('Quick Order / Instant Checkout');
  });

  test('selecting a pack tier updates the total', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Order Family Pack/i }).click();

    const modal = modalOverlay(page);

    // Starter (1 bottle) = ₦10,000
    await modal.getByRole('button', { name: /Starter/ }).click();
    await expect(modal).toContainText(naira(STARTER));

    // Full House (3 bottles) = ₦20,000
    await modal.getByRole('button', { name: /Full House/ }).click();
    await expect(modal).toContainText(naira(FULL_HOUSE));

    // Landlord (5 bottles) = ₦25,000
    await modal.getByRole('button', { name: /Landlord/ }).click();
    await expect(modal).toContainText(naira(LANDLORD));
  });

  test('the four published tiers are advertised sitewide', async ({ page }) => {
    await page.goto('/products');

    for (const price of [STARTER, FAMILY, FULL_HOUSE, LANDLORD]) {
      await expect(page.locator('body')).toContainText(naira(price));
    }

    // 500ml is the only size on sale (the copy mentions the retired sizes).
    await expect(page.locator('body')).toContainText('ONE 500ML SIZE');
  });
});

test.describe('Order channels', () => {
  test('the home page offers Order Now, WhatsApp, call and email', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: /^Order Now$/ }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Instant WhatsApp/i }).first()).toHaveAttribute(
      'href',
      /wa\.me\/2348023725740/
    );
    await expect(page.getByRole('link', { name: /Call 08023725740/i }).first()).toHaveAttribute(
      'href',
      'tel:08023725740'
    );
    await expect(page.getByRole('link', { name: /Email us/i }).first()).toHaveAttribute(
      'href',
      /^mailto:lesekeseproducts@gmail\.com/
    );
  });

  test('Order Now opens the form with all three alternative channels', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /^Order Now$/ }).first().click();

    const modal = modalOverlay(page);
    await expect(modal).toContainText('Order Now');
    await expect(modal.getByLabel('Full name *')).toBeVisible();
    await expect(modal.getByLabel(/Phone \/ WhatsApp/)).toBeVisible();
    await expect(modal.getByLabel('State *')).toBeVisible();

    // Instant alternatives sit under the form, same modal.
    await expect(modal.getByRole('link', { name: /Instant WhatsApp Checkout/i })).toHaveAttribute(
      'href',
      /wa\.me\/2348023725740/
    );
    await expect(modal.getByRole('link', { name: /Call Dispatch Directly/i })).toHaveAttribute(
      'href',
      'tel:08023725740'
    );
    await expect(modal.getByRole('link', { name: /Email my order/i })).toHaveAttribute(
      'href',
      /^mailto:lesekeseproducts@gmail\.com/
    );
  });

  test('the order form posts to the Formspree endpoint and shows confirmation', async ({ page }) => {
    // Capture the submission instead of sending real orders.
    let payload: Record<string, unknown> | null = null;
    await page.route('https://formspree.io/f/mrpzqnyz', async (route) => {
      const body = route.request().postData();
      payload = body ? (JSON.parse(body) as Record<string, unknown>) : null;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto('/');
    await page.getByRole('button', { name: /^Order Now$/ }).first().click();
    const modal = modalOverlay(page);

    await modal.getByLabel('Full name *').fill('Ada Okafor');
    await modal.getByLabel(/Phone \/ WhatsApp/).fill('08023725740');
    await modal.getByLabel('State *').selectOption('Lagos');
    await modal.getByLabel('City / LGA *').fill('Ikeja');
    await modal.getByLabel('Street / area *').fill('14 Allen Avenue');
    await modal.getByRole('button', { name: /Send my order/i }).click();

    await expect(modal).toContainText('Order received');

    // Field names must stay stable for the existing Formspree notification template.
    expect(payload).not.toBeNull();
    const p = payload as unknown as Record<string, string>;
    expect(p.full_name).toBe('Ada Okafor');
    expect(p.phone_number).toBe('08023725740');
    expect(p.delivery_address).toContain('14 Allen Avenue');
    expect(p.delivery_address).toContain('Lagos');
    expect(p.package).toContain('500ml');
    expect(p.source).toContain('Order Now form');
    expect(p.reference).toMatch(/^LSK-/);

    await page.unroute('https://formspree.io/f/mrpzqnyz');
  });

  test('the order form blocks submission until delivery details are filled', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /^Order Now$/ }).first().click();

    const modal = modalOverlay(page);
    await modal.getByLabel('Full name *').fill('Ada Okafor');
    await modal.getByLabel(/Phone \/ WhatsApp/).fill('08023725740');
    await modal.getByRole('button', { name: /Send my order/i }).click();

    // Native validation must block the submit and keep the form open.
    await expect(modal).toContainText('Order Now');
    await expect(modal.getByLabel('City / LGA *')).toBeVisible();
  });
});
