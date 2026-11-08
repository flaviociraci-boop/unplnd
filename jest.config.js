/** Jest config — Expo preset (mocks RN + Expo modules), with our `@/` path alias. */
module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  // Generated native projects (Pods etc.) are huge and contain no tests — never crawl them.
  modulePathIgnorePatterns: ['<rootDir>/ios/', '<rootDir>/android/', '<rootDir>/website/'],
};
