module.exports = {
  roots: ['<rootDir>/bin'],
  collectCoverageFrom: ['<rootDir>/bin/**/*.ts', '!<rootDir>/modules/**'],
  coverageDirectory: 'coverage',
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
};
