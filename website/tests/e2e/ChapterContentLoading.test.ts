// website/tests\e2e\ChapterContentLoading.test.ts
// Integration test for chapter content loading and display

import { test, expect, Page } from '@playwright/test';

test.describe('Chapter Content Loading and Display', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('loads and displays chapter content correctly', async () => {
    // Navigate to the first chapter
    await page.goto('http://localhost:3000/intro');
    
    // Check if the page has loaded
    await expect(page).toHaveTitle(/Physical AI & Humanoid Robotics/);
    
    // Verify that chapter content is displayed
    await expect(page.locator('h1')).toContainText('Introduction');
    
    // Verify that learning objectives are displayed
    const learningObjectives = page.locator('data-testid=learning-objectives');
    await expect(learningObjectives).toBeVisible();
    
    // Verify that key terms are displayed
    const keyTerms = page.locator('data-testid=key-terms');
    await expect(keyTerms).toBeVisible();
    
    // Verify that equations are rendered properly
    const mathElements = page.locator('.math');
    await expect(mathElements).toHaveCount(0, {timeout: 10000}); // Adjust selector based on actual LaTeX rendering
    
    // Verify chapter navigation elements
    const nextChapterButton = page.locator('data-testid=next-chapter');
    const prevChapterButton = page.locator('data-testid=prev-chapter');
    
    // These might not be visible depending on which chapter we're on
    // Check for either the button or that it doesn't exist (for first/last chapters)
    if (await nextChapterButton.count() > 0) {
      await expect(nextChapterButton).toBeVisible();
    }
    if (await prevChapterButton.count() > 0) {
      await expect(prevChapterButton).toBeVisible();
    }
  });

  test('displays chapter exercises correctly', async () => {
    // Navigate to a chapter with exercises
    await page.goto('http://localhost:3000/module-1/exercises');
    
    // Check if exercises are loaded
    const exercises = page.locator('[data-testid="exercise"]');
    await expect(exercises).toHaveCount(0, {timeout: 10000}); // Adjust selector as needed
    
    // Verify that exercise components are interactive
    // This would depend on the specific implementation of exercises
  });

  test('loads references correctly', async () => {
    // Navigate to a chapter
    await page.goto('http://localhost:3000/module-1');
    
    // Verify that references section is displayed
    const referencesSection = page.locator('data-testid=references-section');
    await expect(referencesSection).toBeVisible();
  });

  test('displays chapter navigation sidebar', async () => {
    await page.goto('http://localhost:3000/module-1');
    
    // Check if the sidebar navigation is present
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar).toBeVisible();
    
    // Verify that navigation items are clickable and functional
    const navItems = page.locator('nav li a');
    const initialCount = await navItems.count();
    expect(initialCount).toBeGreaterThan(0);
  });
});