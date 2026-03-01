import { beforeAll, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

// Mock environment variables
beforeAll(() => {
  // Set up any global test configuration here
  global.import = {
    meta: {
      env: {
        DEV: false, // Set to false for tests to avoid debug logs
      },
    },
  };
});

// Clean up after each test
afterEach(() => {
  // Clear localStorage after each test
  localStorage.clear();
});
