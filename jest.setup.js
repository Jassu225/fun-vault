require('@testing-library/jest-dom');

// Polyfill for setImmediate in test environment
if (typeof setImmediate === 'undefined') {
  global.setImmediate = (callback, ...args) => {
    return setTimeout(() => callback(...args), 0);
  };
}

// Global cleanup after all tests
afterAll(async () => {
  // Wait a bit for any pending operations
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }

  // Clear any remaining timers
  jest.clearAllTimers();
});
