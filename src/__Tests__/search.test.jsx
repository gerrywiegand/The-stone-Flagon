import React from "react";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { vi, describe, it, afterEach, expect } from "vitest";
import { renderWithProviders } from "../test/setup";
import DrinkList from "../pages/DrinkList";

const DRINKS = [
  {
    id: 1,
    name: "Ale",
    price: 5,
    description: "",
    imageUrl: "",
    inStock: true,
  },
  {
    id: 2,
    name: "Mead",
    price: 6,
    description: "",
    imageUrl: "",
    inStock: true,
  },
  {
    id: 3,
    name: "Stout",
    price: 7.5,
    description: "",
    imageUrl: "",
    inStock: true,
  },
];

function mockFetchOnce(payload, { ok = true, status = 200 } = {}) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => payload,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("DrinkList - Search filter", () => {
  it("renders the list and is ready to filter", async () => {
    mockFetchOnce(DRINKS);

    renderWithProviders(<DrinkList />, { route: "/drinks" });

    await waitFor(() => {
      // exact match to avoid grabbing the sidebar sentence
      expect(screen.getAllByText(/^Ale$/i)[0]).toBeInTheDocument();
    });
    expect(screen.getAllByText(/^Mead$/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/^Stout$/i)[0]).toBeInTheDocument();
  });

  it("filters the list when the user types", async () => {
    mockFetchOnce(DRINKS);

    renderWithProviders(<DrinkList />, { route: "/drinks" });

    // Wait for initial items
    await waitFor(() => {
      expect(screen.getAllByText(/^Ale$/i)[0]).toBeInTheDocument();
    });

    // Type "al" should leave Ale visible, hide Mead/Stout if your filter works that way
    const input = screen.getByPlaceholderText(/search drinks/i);
    fireEvent.change(input, { target: { value: "al" } });

    // After filtering
    expect(screen.getAllByText(/^Ale$/i)[0]).toBeInTheDocument();
    expect(screen.queryByText(/^Mead$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Stout$/i)).not.toBeInTheDocument();
  });
});
