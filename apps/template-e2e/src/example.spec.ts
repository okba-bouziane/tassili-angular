import { expect, test } from '@playwright/test';

test('has the brand title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Tassili/);
});
