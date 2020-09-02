module.exports = {
  bail: 1,
  clearMocks: true,
  collectCoverage: true,
  setupFiles: ['dotenv/config'],
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!**/test/**'],
  coverageDirectory: 'coverage',
  // coverageProvider: 'v8',
  // coverageReporters: ['text', 'lcov'],
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  // testMatch: ['**/__tests__/**/*.test.js'],
};
