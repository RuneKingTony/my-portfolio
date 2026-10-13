import { expect, test } from '@playwright/test';

// Runs against the built site in out/ (see playwright.config.ts).

test('every section renders, the theme toggles and the console stays clean', async ({
  page,
}) => {
  const problems: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(message.text());
  });
  page.on('pageerror', (error) => problems.push(error.message));

  await page.goto('/');

  await expect(
    page.getByRole('heading', { level: 1, name: 'Anthony Nkwa' })
  ).toBeVisible();
  await expect(page.getByRole('figure', { name: 'Departures' })).toBeVisible();
  await expect(page.locator('.map-horizontal')).toBeVisible();
  for (const name of [
    'About',
    'Experience',
    'Projects',
    'On GitHub',
    'Let’s work together',
  ]) {
    await expect(page.getByRole('heading', { level: 2, name })).toBeAttached();
  }
  await expect(page.locator('.line-section')).not.toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Send by email' })
  ).toBeVisible();

  const html = page.locator('html');
  const toggle = page.getByRole('button', { name: 'Switch to light mode' });
  await toggle.click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(html).toHaveAttribute('data-theme', 'dark');

  expect(problems).toStrictEqual([]);
});
