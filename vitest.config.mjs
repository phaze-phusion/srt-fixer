import { configDefaults, defineConfig } from 'vitest/config'
// Configure Vitest (https://vitest.dev/config/)
// Difference between 'it' and 'test': https://stackoverflow.com/questions/45778192/what-is-the-difference-between-it-and-test-in-jest

const updatedConfigs =  defineConfig({
  test: {
    root: './',
    include: ['tests/**/*.test.js'],
    exclude: [...configDefaults.exclude],
    coverage: {
      include: ['src/**/*'],
      provider: 'istanbul',
      all: true,
    }
  },
});

export default updatedConfigs;
