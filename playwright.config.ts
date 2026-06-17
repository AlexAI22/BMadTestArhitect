import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load variables from .env (falls back to process env / CI secrets when absent).
dotenv.config();

/**
 * ---------------------------------------------------------------------------
 * MCP (Model Context Protocol) Browser Automation Note
 * ---------------------------------------------------------------------------
 * TEA config: tea_browser_automation: "mcp"
 *
 * This project is authored to be driven via the Playwright MCP server so that
 * an AI agent (Claude Code) can explore, generate and maintain tests against a
 * live browser session through MCP tool calls. The runtime contract below
 * (baseURL, chromium, headless, traces, screenshots) is shared by BOTH the
 * standard `npx playwright test` runner AND the MCP server, so generated tests
 * behave identically whether executed by CI or driven interactively by the
 * agent.
 *
 * To run the MCP server locally (Claude Code / any MCP client):
 *
 *   npx @playwright/mcp@latest --headless --browser chromium
 *
 * Suggested MCP client registration (e.g. .mcp.json / claude_desktop_config):
 *   {
 *     "mcpServers": {
 *       "playwright": {
 *         "command": "npx",
 *         "args": ["@playwright/mcp@latest", "--headless", "--browser", "chromium"]
 *       }
 *     }
 *   }
 *
 * See README.md > "MCP server configuration" for full setup instructions.
 * ---------------------------------------------------------------------------
 */

// Use `||` (not `??`) so an unset CI secret — which GitHub renders as an empty
// string, not undefined — falls back to the public demo default.
const BASE_URL =
  process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests/e2e',

  // Fail the build on CI if test.only is accidentally left in source.
  forbidOnly: isCI,

  // Run tests within files in parallel — all tests are self-contained.
  fullyParallel: true,

  // Retry on CI to absorb demo-site flakiness; never retry locally so flake is visible.
  retries: isCI ? 2 : 0,

  // Limit workers on CI for stability; use Playwright defaults locally.
  workers: isCI ? 2 : undefined,

  // Global per-test timeout and assertion timeout.
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },

  // HTML report for humans, list reporter for terminal/CI logs.
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: BASE_URL,

    // Capture trace and screenshot only when a test fails (keeps artifacts lean).
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Network-first defaults: generous action/navigation budgets, no hard waits.
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  // The default headless `chromium` project runs everywhere (incl. CI). The
  // headed real-Chrome project is a LOCAL observation aid and is excluded on CI:
  // a CI runner has no display, so a headed browser cannot launch there.
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
    // Local-only: real Google Chrome (stable channel), headed, with slowMo.
    ...(isCI
      ? []
      : [
          {
            // Run with: npm run test:chrome   (opens a visible Chrome window)
            name: 'chrome',
            use: {
              ...devices['Desktop Chrome'],
              channel: 'chrome',
              headless: false,
              // slowMo adds a 1000ms pause between each Playwright action so the
              // run is easy to follow by eye. This is a browser-level observation
              // aid, NOT a hard wait in test code — specs remain network-first.
              launchOptions: {
                slowMo: 1000,
              },
            },
          },
        ]),
  ],
});
