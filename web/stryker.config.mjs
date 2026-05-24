/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: 'vitest',
  mutate: [
    'src/utils/**/*.{ts,tsx}',
    '!src/utils/**/*.test.{ts,tsx}',
  ],
  vitest: {
    configFile: 'vite.config.js',
  },
  reporters: ['clear-text'],
  tempDirName: 'stryker-tmp',
};
