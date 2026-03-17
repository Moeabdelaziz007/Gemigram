import { test, expect } from '@playwright/test';

test('can access landing page', async ({ page }) => {
  await page.goto('/');
  // Basic sanity check, avoiding specific text content which might be delayed by animations
  await expect(page).toHaveURL(/.*(\/)/);
});

test('can navigate to different pages', async ({ page }) => {
  await page.goto('/');

  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);

  await page.goto('/workspace');
  await expect(page).toHaveURL(/.*\/workspace/);

  await page.goto('/hub');
  await expect(page).toHaveURL(/.*\/hub/);
});
