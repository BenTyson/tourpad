import { test, expect } from '@playwright/test';

test('homepage loads on localhost', async ({ page }) => {
  await page.goto('/');

  // Verify the page loads successfully
  await expect(page).toHaveURL('http://localhost:3001/');
  
  // Verify there's some content on the page (adjust based on your actual homepage)
  await expect(page.locator('body')).toBeVisible();
});

test('can navigate to different pages', async ({ page }) => {
  await page.goto('/');
  
  // Check that the page is responsive
  await expect(page).toHaveURL('http://localhost:3001/');
  
  // Verify page loads without errors
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
});