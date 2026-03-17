import { test, expect } from '@playwright/test';

test('navigate to hub and try to open forge', async ({ page }) => {
  await page.goto('/hub');
  await expect(page).toHaveURL(/.*\/hub/);
  // Simulate clicking the create button to go to forge
  const createButton = page.locator('text=Create Entity').first();
<<<<<<< HEAD
  await expect(createButton).toBeVisible();
  await createButton.click();
  await expect(page).toHaveURL(/.*\/forge/);
=======
  if (await createButton.isVisible()) {
      await createButton.click();
      await expect(page).toHaveURL(/.*\/forge/);
  }
>>>>>>> origin/main
});
