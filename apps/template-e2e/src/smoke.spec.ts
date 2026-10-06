import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('has the brand title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Tassili/);
});

test('has no detectable accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('has no horizontal scroll at the current viewport', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
