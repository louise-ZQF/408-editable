import { defineConfig } from "@playwright/test";

/**
 * E2E 测试：运行前需先 npm run build（-w client 产物供 preview 直测）。
 * hash 路由（/#/...），vite preview 天然兼容，无需 history rewrite。
 */
export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4173",
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run preview -w client -- --port 4173 --strictPort",
    port: 4173,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});