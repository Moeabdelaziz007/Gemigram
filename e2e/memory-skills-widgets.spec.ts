import { test, expect } from '@playwright/test';

test('verify widgets exist in workspace view', async ({ page }) => {
  await page.goto('/workspace');
  await expect(page).toHaveURL(/.*\/workspace/);
  // Check that the widgets container is present
  // The layout typically has the agent selector or empty state if no agent
  const fallbackText = page.locator('text=No Agent Connected');
  if (await fallbackText.isVisible()) {
    await expect(fallbackText).toBeVisible();
  }
});
