/**
 * Jest configuration for Hunt the Wumpus testing
 */

/** @type {import('jest').Config} */
const config = {
  // Clear mocks automatically between tests
  clearMocks: true,

  // Use v8 for code coverage
  coverageProvider: 'v8',

  // Enable collecting coverage information
  collectCoverage: false,

  // Configure coverage collection
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
  ],

  // Coverage directory
  coverageDirectory: 'coverage',

  // Coverage thresholds
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },

  // Using default Node environment for now
  // testEnvironment: "jsdom",

  // File extensions to use
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Handle asset imports in tests
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
  },

  // We'll add setup files later when needed
  // setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  // Use ts-jest for TypeScript files
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // Test matching patterns
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],

  // Explicitly exclude mocks from being treated as tests
  testPathIgnorePatterns: ['/node_modules/', '/__mocks__/', '/__tests__/mocks/'],

  // Be verbose in test output
  verbose: false,
};

module.exports = config;
