// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('http://localhost:8080/');
  });

  test('is generate feeds and posts', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Rss agregator/);

    // create a locator
    const button = page.locator('text=Добавить');
    await expect(button).toHaveAttribute('type', 'submit');
    const input = page.locator('#url-input');
    await input.fill('https://ru.hexlet.io/lessons.rss');

    await button.click();

    await page.waitForTimeout(5000);

    const posts = page.locator('.posts');
    const feeds = page.locator('.feeds');
    const postsContent = await posts.innerText();
    const feedsContent = await feeds.innerText();
    await expect(button).toBeEnabled();

    expect(postsContent).not.toBe('');
    expect(feedsContent).not.toBe('');
  });
  test('is not generate feeds and posts', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Rss agregator/);

    // create a locator
    const button = page.locator('text=Добавить');
    await expect(button).toHaveAttribute('type', 'submit');
    const input = page.locator('#url-input');
    await input.fill('14324');

    await button.click();

    await page.waitForTimeout(5000);

    const posts = page.locator('.posts');
    const feeds = page.locator('.feeds');
    const postsContent = await posts.innerText();
    const feedsContent = await feeds.innerText();
    await expect(button).toBeEnabled();

    expect(postsContent).toBe('');
    expect(feedsContent).toBe('');
  });
});
