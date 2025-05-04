import React from 'react';
import { createRoot } from 'react-dom/client';

// Mock react-dom/client
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));

// Mock App component
jest.mock('../App', () => {
  return function MockApp() {
    return <span data-testid="mock-app">Mock App Component</span>;
  };
});

describe('Index', () => {
  let originalGetElementById: typeof document.getElementById;

  beforeEach(() => {
    // Store the original implementation
    originalGetElementById = document.getElementById;

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore the original implementation
    document.getElementById = originalGetElementById;
  });

  test('renders App component into DOM', () => {
    // Mock document.getElementById
    const mockRootElement = document.createElement('div');
    document.getElementById = jest.fn(() => mockRootElement);

    // Import index.tsx to trigger the code execution
    require('../index');

    // Check if getElementById was called with 'root'
    expect(document.getElementById).toHaveBeenCalledWith('root');

    // Check if createRoot was called with the root element
    expect(createRoot).toHaveBeenCalledWith(mockRootElement);

    // Check if render was called with App component
    const mockRoot = (createRoot as jest.Mock).mock.results[0].value;
    expect(mockRoot.render).toHaveBeenCalled();
  });
});
