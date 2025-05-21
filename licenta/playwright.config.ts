import { defineConfig, devices } from "@playwright/test";

const API_TEST_REGEX = /e2e\/tests\/api\/.*\.spec\.ts/;
const LOCALHOST = "http://localhost:5173";

export default defineConfig({
  testDir: "e2e/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0, // Retries are still active for CI
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["list"], // Afișează un sumar rapid în consolă
    [
      "allure-playwright",
      {
        outputFolder: "allure-results",
        suiteTitle: true,
        categories: [
          // Categorii personalizate pentru o mai bună organizare a testelor
          {
            name: "Teste Instabile (Flaky)",
            messageRegex: ".*Flaky.*", // Orice test care conține "Flaky" în mesajul de eroare
            matchedStatuses: ["failed", "broken"],
          },
          {
            name: "Teste Ignorate (Skipped)",
            messageRegex: ".*Ignored.*", // Orice test cu mesaj "Ignored"
            matchedStatuses: ["skipped"],
          },
          {
            name: "Erori de Mediu/Configurare", // Categorie nouă pentru erori de tip setup/teardown
            messageRegex:
              ".*(Timeout|Connection refused|Browser closed unexpectedly).*",
            matchedStatuses: ["broken"],
          },
        ],
        environmentInfo: {
          // Informații despre mediul de rulare, vizibile în raport
          "App URL": process.env.APP_URL || LOCALHOST,
          Browser: process.env.PLAYWRIGHT_BROWSER || "Chromium",
          "Node.js Version": process.version,
          "OS Platform": process.platform,
        },
        detail: true,
      },
    ],
  ],

  use: {
    baseURL: LOCALHOST,
    trace: "on-first-retry",
    headless: true,
    screenshot: "on-first-retry",
    video: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "api",
      use: {
        baseURL: "https://dummyjson.com",
      },
      testMatch: API_TEST_REGEX,
    },
  ],
});
