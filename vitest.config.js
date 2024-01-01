import { defineConfig } from 'vitest/config'
// Configure Vitest (https://vitest.dev/config/)
// Difference between 'it' and 'test': https://stackoverflow.com/questions/45778192/what-is-the-difference-between-it-and-test-in-jest

export default defineConfig({
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
  },
})
