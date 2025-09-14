import "@testing-library/jest-dom";

// Mock Next.js router if needed
jest.mock("next/router", () => require("next-router-mock"));

// Mock Next.js navigation if using App Router
jest.mock("next/navigation", () => require("next-router-mock"));

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});
