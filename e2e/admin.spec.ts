import { test, expect } from '@playwright/test';

test.describe('Admin portal', () => {
  test('no longer accepts a client-side passkey', async ({ page }) => {
    await page.goto('/admin');

    // The old build compared the literal "lesekese2026" in the browser bundle.
    // Nothing may ask for a passkey any more.
    await expect(page.getByPlaceholder(/Enter admin/i)).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Login to Dashboard/i })).toHaveCount(0);
  });

  test('never ships the hardcoded passkey to the client bundle', async ({ page }) => {
    // Use /adminlogin (not /admin): /admin now forwards anonymous visitors to
    // /adminlogin, and the forward would destroy the context mid-evaluate.
    await page.goto('/adminlogin');
    const html = await page.content();
    expect(html).not.toContain('lesekese2026');

    const js = await page.evaluate(async () => {
      const src = document.querySelector('script[type="module"]')?.getAttribute('src');
      if (!src) return '';
      return await (await fetch(src)).text();
    });
    expect(js).not.toContain('lesekese2026');
  });

  test('renders outside the marketing shell', async ({ page }) => {
    await page.goto('/admin');
    // Staff should not scroll past Navbar/Footer marketing content.
    await expect(page.getByRole('banner')).toHaveCount(0);
    await expect(page.getByRole('contentinfo')).toHaveCount(0);
  });

  test('explains the setup when Supabase credentials are missing', async ({ page }) => {
    await page.goto('/admin');

    // Unconfigured in CI/local: the page must guide the operator instead of
    // silently rendering an empty dashboard.
    const unconfigured = page.getByRole('heading', { name: /Supabase is not connected/i });
    const login = page.getByRole('heading', { name: 'LESEKESE Admin' });

    await expect(unconfigured.or(login)).toBeVisible();

    if (await unconfigured.isVisible()) {
      await expect(page.getByText(/VITE_SUPABASE_URL/)).toBeVisible();
      await expect(page.getByText(/VITE_SUPABASE_PUBLISHABLE_KEY/)).toBeVisible();
      await expect(page.getByText(/0001_admin_cms\.sql/)).toBeVisible();
    }
  });

  test('login form uses Supabase email and password when configured', async ({ page }) => {
    await page.goto('/adminlogin');
    await skipUnlessLoginVisible(page);

    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByText(/allowlisted staff accounts/i)).toBeVisible();
  });

  test('login inputs render dark text on a light background', async ({ page }) => {
    // Regression: the login card used to append `text-white bg-slate-950` on top
    // of the shared input class. Tailwind resolves conflicting utilities by
    // stylesheet order, not class-attribute order, so `bg-white` won while
    // `text-white` won too — white text on a white background, invisible once
    // the admin started typing. Assert the *computed* style so the test fails
    // on the symptom rather than on the class names.
    await page.goto('/adminlogin');
    await skipUnlessLoginVisible(page);

    for (const field of [
      page.getByLabel('Email address'),
      page.getByLabel('Password'),
    ]) {
      await expect(field).toBeVisible();
      const style = await field.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { color: cs.color, background: cs.backgroundColor };
      });
      // Dark foreground on a light surface, and enough contrast to read (WCAG AA).
      expect(contrast(style.color, style.background)).toBeGreaterThanOrEqual(4.5);
      expect(luminance(style.background)).toBeGreaterThan(0.5);
    }
  });

  test('login offers Google sign-in and a link back to the site', async ({ page }) => {
    await page.goto('/adminlogin');
    await skipUnlessLoginVisible(page);

    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /back to website/i })).toHaveAttribute('href', '/');
  });
});

/**
 * Skips the calling test when the login screen is genuinely absent, i.e. the
 * app is running without Supabase credentials.
 *
 * The check must use `waitFor({ state: 'visible' })` rather than
 * `isVisible()`: `isVisible()` returns immediately and ignores the timeout,
 * so while the entrance animation was still mid-flight the heading already
 * existed in the DOM but was not yet visible, and the guard reported the page
 * as unconfigured and skipped the test. `waitFor` genuinely polls.
 */
async function skipUnlessLoginVisible(page: import('@playwright/test').Page) {
  const login = page.getByRole('heading', { name: 'LESEKESE Admin' });
  const visible = await login
    .waitFor({ state: 'visible', timeout: 45_000 })
    .then(() => true)
    .catch(() => false);
  if (!visible) test.skip(true, 'Supabase is not configured in this environment');
}

/* --- minimal WCAG contrast helpers, no dependency needed --- */

function luminance(rgb: string): number {
  const [r, g, b] = parseRgb(rgb);
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function parseRgb(value: string): [number, number, number] {
  const m = value.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) throw new Error(`Unexpected colour value: ${value}`);
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}

test.describe('Blog (public)', () => {
  // These pages do a real Supabase round trip, so the first request in a run
  // pays DNS + TLS setup. Allow a realistic budget rather than the 5s
  // default, otherwise a cold network makes this a flake.
  const NETWORK_BUDGET = 20_000;

  test('/blog renders a heading', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: NETWORK_BUDGET });
  });

  test('unknown article slugs show a not-found state rather than the home page', async ({ page }) => {
    await page.goto('/blog/this-post-does-not-exist-9f3a');
    await expect(page.getByRole('heading', { name: /Article not found/i })).toBeVisible({
      timeout: NETWORK_BUDGET,
    });
  });

  test('blog keeps the marketing shell', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('banner')).toBeVisible();
  });
});
