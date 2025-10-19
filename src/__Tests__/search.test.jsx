import React from "react";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { vi, describe, it, afterEach } from "vitest";
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
      expect(screen.getByText(/Ale/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Mead/i)).toBeInTheDocument();
    expect(screen.getByText(/Stout/i)).toBeInTheDocument();
  });
});

it("filters the list when the user types", async () => {
  // Arrange
  mockFetchOnce(DRINKS);

  // Act
  renderWithProviders(<DrinkList />, { route: "/drinks" });

  // Wait for initial items
  await waitFor(() => {
    expect(screen.getByText(/Ale/i)).toBeInTheDocument();
  });
  expect(screen.getByText(/Mead/i)).toBeInTheDocument();
  expect(screen.getByText(/Stout/i)).toBeInTheDocument();

  // Find the search input (by accessible name or placeholder)
  let input;
  try {
    input = screen.getByRole("textbox", { name: /search drinks/i });
  } catch {
    input = screen.getByPlaceholderText(/search drinks/i);
  }

  // Type "al" → should match only "Ale"
  fireEvent.change(input, { target: { value: "al" } });

  expect(screen.getByText(/Ale/i)).toBeInTheDocument();
  expect(screen.queryByText(/Mead/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Stout/i)).not.toBeInTheDocument();

  // Clear → all items return
  fireEvent.change(input, { target: { value: "" } });
  expect(screen.getByText(/Ale/i)).toBeInTheDocument();
  expect(screen.getByText(/Mead/i)).toBeInTheDocument();
  expect(screen.getByText(/Stout/i)).toBeInTheDocument();
});
