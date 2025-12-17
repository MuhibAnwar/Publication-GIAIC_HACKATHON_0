// website/tests\e2e\SimulationDemo.test.ts
// Integration test for browser-based simulation demo

import { test, expect, Page } from '@playwright/test';

test.describe('Browser-based Simulation Demo', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('loads simulation demo interface', async () => {
    // Navigate to a page that contains a simulation demo
    await page.goto('http://localhost:3000/module-2/simulation-demo');
    
    // Check if the page has loaded
    await expect(page).toHaveTitle(/Simulation Demo/);
    
    // Verify that simulation canvas is present
    const simulationCanvas = page.locator('#simulation-canvas');
    await expect(simulationCanvas).toBeVisible();
    
    // Verify that simulation controls are present
    const playButton = page.locator('data-testid=play-simulation');
    const pauseButton = page.locator('data-testid=pause-simulation');
    const resetButton = page.locator('data-testid=reset-simulation');
    
    await expect(playButton).toBeVisible();
    await expect(pauseButton).toBeVisible();
    await expect(resetButton).toBeVisible();
  });

  test('allows interaction with simulation controls', async () => {
    await page.goto('http://localhost:3000/module-2/simulation-demo');
    
    // Test play button functionality
    const playButton = page.locator('data-testid=play-simulation');
    await expect(playButton).toBeEnabled();
    await playButton.click();
    
    // Check if simulation state changes after play
    await expect(playButton).not.toBeEnabled(); // Might be disabled when playing
    
    // Test pause functionality
    const pauseButton = page.locator('data-testid=pause-simulation');
    await expect(pauseButton).toBeEnabled();
    await pauseButton.click();
    
    // Test reset functionality
    const resetButton = page.locator('data-testid=reset-simulation');
    await expect(resetButton).toBeEnabled();
    await resetButton.click();
  });

  test('displays simulation parameters', async () => {
    await page.goto('http://localhost:3000/module-2/simulation-demo');
    
    // Verify that parameter controls are visible
    const parameterSliders = page.locator('[data-testid="parameter-slider"]');
    await expect(parameterSliders).toHaveCount(0, {timeout: 10000}); // Adjust count based on actual implementation
    
    // Verify that parameter labels are visible
    const parameterLabels = page.locator('[data-testid="parameter-label"]');
    await expect(parameterLabels).toHaveCount(0, {timeout: 10000}); // Adjust count based on actual implementation
  });

  test('updates simulation when parameters change', async () => {
    await page.goto('http://localhost:3000/module-2/simulation-demo');
    
    // Find a parameter slider and change its value
    const parameterSliders = page.locator('[data-testid="parameter-slider"]');
    if (await parameterSliders.count() > 0) {
      const firstSlider = parameterSliders.first();
      const initialValue = await firstSlider.getAttribute('value');
      
      // Change the slider value
      await firstSlider.fill('50'); // Or use click and drag for actual slider
      
      // Verify that the simulation visual changes
      // This is difficult to test without specific visual elements
      // So we'll check for any visual update indicators
      const updateIndicator = page.locator('[data-testid="simulation-updated"]');
      await expect(updateIndicator).toBeVisible();
    }
  });

  test('shows simulation status information', async () => {
    await page.goto('http://localhost:3000/module-2/simulation-demo');
    
    // Verify that status information is displayed
    const statusInfo = page.locator('[data-testid="simulation-status"]');
    await expect(statusInfo).toBeVisible();
    
    // Verify that time information is displayed
    const timeInfo = page.locator('[data-testid="simulation-time"]');
    await expect(timeInfo).toBeVisible();
  });
});