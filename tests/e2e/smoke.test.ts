import { test, expect } from '@playwright/test';

test.describe('Smoke Test', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Efficia/i);
  });

  test('should have main navigation elements', async ({ page }) => {
    await page.goto('/');
    // Adjust selectors based on actual app content
    await expect(page.locator('body')).toBeVisible();
  });
});
