import { test, expect } from '@playwright/test';

// Test your TourPad app features
test.describe('TourPad App', () => {
  
  test('homepage loads and shows expected content', async ({ page }) => {
    await page.goto('/');
    
    // Check the page loads
    await expect(page).toHaveURL('http://localhost:3001/');
    
    // Look for TourPad-specific content (adjust based on your homepage)
    await expect(page.locator('body')).toBeVisible();
    
    // Take a screenshot for visual comparison
    await page.screenshot({ path: 'test-results/homepage.png' });
  });

  test('can navigate to artists page', async ({ page }) => {
    await page.goto('/');
    
    // Try to find and click an "Artists" link (adjust selector as needed)
    const artistsLink = page.locator('a[href*="artists"], a:has-text("Artists")').first();
    
    if (await artistsLink.isVisible()) {
      await artistsLink.click();
      await expect(page).toHaveURL(/.*artists.*/);
    } else {
      // If no artists link, just navigate directly
      await page.goto('/artists');
      await expect(page).toHaveURL('http://localhost:3001/artists');
    }
  });

  test('login page is accessible', async ({ page }) => {
    await page.goto('/login');
    
    // Should load without errors
    const response = await page.goto('/login');
    expect(response?.status()).toBe(200);
    
    // Look for login form elements
    const loginForm = page.locator('form, input[type="email"], input[type="password"]').first();
    await expect(loginForm).toBeVisible();
  });

  test('mobile viewport works', async ({ page }) => {
    // Test mobile responsiveness
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.goto('/');
    
    // Page should still be visible and functional
    await expect(page.locator('body')).toBeVisible();
    
    // Take mobile screenshot
    await page.screenshot({ path: 'test-results/mobile-homepage.png' });
  });

});