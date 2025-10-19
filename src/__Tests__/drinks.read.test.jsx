import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { renderWithProviders } from "../test/setup.jsx";
import { DRINKS } from "../test/fixtures";
import DrinkList from "../pages/DrinkList";

// Helper to mock a single successful fetch
function mockFetchOnce(payload, { ok = true, status = 200 } = {}) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => payload,
  });
}

describe("DrinkList - Read", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows drinks after loading completes", async () => {
    // Arrange: mock GET /drinks
    mockFetchOnce(DRINKS);

    // Act: render list page
    renderWithProviders(<DrinkList />, { route: "/drinks" });

    await waitFor(() => {
      expect(screen.getAllByText(/^Ale$/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/^Stout$/i)[0]).toBeInTheDocument();
    });

    // price formatting (from your .toFixed(2))
    expect(screen.getByText(/\$5\.00/)).toBeInTheDocument();
    expect(screen.getByText(/\$7\.50/)).toBeInTheDocument();
  });
});
