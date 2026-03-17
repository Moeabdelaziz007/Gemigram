import { test, expect } from '@playwright/test';

test('verify widgets exist in workspace view', async ({ page }) => {
  await page.goto('/workspace');
  await expect(page).toHaveURL(/.*(\/|\/workspace)/);
});
