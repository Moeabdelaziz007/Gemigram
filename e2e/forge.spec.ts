import { test, expect } from '@playwright/test';

test('navigate to forge and render correctly', async ({ page }) => {
  await page.goto('/forge');

  await expect(page).toHaveURL(/.*\/forge/);
  // Wait for some text to make sure the page rendered properly
  await expect(page.locator('text=Gemi_Forge_v4')).toBeVisible();
});
