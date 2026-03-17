import { test, expect } from '@playwright/test';

test('navigate to hub and try to open forge', async ({ page }) => {
  await page.goto('/hub');
  await expect(page).toHaveURL(/.*\/hub/);
  // Simulate clicking the create button to go to forge
  const createButton = page.locator('text=Create Entity').first();
  if (await createButton.isVisible()) {
      await createButton.click();
      await expect(page).toHaveURL(/.*\/forge/);
  } else {
      const altButton = page.locator('text=Create New Agent').first();
      if (await altButton.isVisible()) {
          await altButton.click();
          await expect(page).toHaveURL(/.*\/forge/);
      }
  }
});
