import { defineConfig, devices } from '@playwright/test';

const port = 4173;
const isCi = process.env.CI === 'true';

export default defineConfig({
  testDir: 'e2e',
  forbidOnly: isCi,
  reporter: isCi ? 'github' : 'list',
  use: { baseURL: `http://localhost:${port}` },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `serve out --listen ${port} --no-request-logging`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !isCi,
  },
});
