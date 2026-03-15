import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Gemigram/);
});

test('can navigate to different pages', async ({ page }) => {
  await page.goto('/');
  // Basic navigation check, skipping deep functionality

  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);

  await page.goto('/workspace');
  await expect(page).toHaveURL(/.*\/workspace/);

  await page.goto('/hub');
  await expect(page).toHaveURL(/.*\/hub/);
});
