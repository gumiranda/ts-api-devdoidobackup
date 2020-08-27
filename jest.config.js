module.exports = {
  bail: 1,
  clearMocks: true,
  collectCoverage: true,
  roots: ['<rootDir>/bin', '<rootDir>/modules'],
  collectCoverageFrom: ['<rootDir>/bin/**/*.ts', '<rootDir>/modules/**/*.ts'],
  //collectCoverageFrom: ['modules/**/*.js'],
  coverageDirectory: 'coverage',
  //coverageProvider: 'v8',
  //coverageReporters: ['text', 'lcov'],
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  // testMatch: ['**/__tests__/**/*.test.js'],
};
