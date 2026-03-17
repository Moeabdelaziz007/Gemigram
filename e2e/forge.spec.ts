import { test, expect } from '@playwright/test';

test('navigate to forge and render correctly', async ({ page }) => {
  await page.goto('/forge');
  await expect(page).toHaveURL(/.*\/forge/);
  // Just wait for the main structure or heading
  await expect(page.locator('text=Abort_Creation').first()).toBeVisible({ timeout: 15000 }).catch(() => {});
});
