/**
 * Jest configuration for Hunt the Wumpus testing
 */

/** @type {import('jest').Config} */
const config = {
  // Clear mocks automatically between tests
  clearMocks: true,

  // Use v8 for code coverage
  coverageProvider: "v8",

  // Using default Node environment for now
  // testEnvironment: "jsdom",

  // File extensions to use
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],

  // Handle asset imports in tests
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/src/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/__mocks__/fileMock.js"
  },

  // We'll add setup files later when needed
  // setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  // Use ts-jest for TypeScript files
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },

  // Test matching patterns
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],

  // Be verbose in test output
  verbose: true
};

module.exports = config;
