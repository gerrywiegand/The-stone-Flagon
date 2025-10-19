import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// --- Mock Auth (mutable) BEFORE importing App ---
let mockAuth = {
  isAdmin: true, // start as admin so we can hit /drinks/new too
  login: vi.fn(),
  logout: vi.fn(),
};

vi.mock("../auth/AuthContext.jsx", () => ({
  useAuth: () => mockAuth,
  AuthProvider: ({ children }) => <>{children}</>,
}));

// Minimal fetch mock to satisfy /drinks list render
function mockFetchForRouting() {
  global.fetch = vi.fn().mockImplementation(async (url) => {
    const href = String(url);

    // GET /drinks
    if (/\/drinks$/.test(href)) {
      return {
        ok: true,
        status: 200,
        json: async () => [
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
            name: "Stout",
            price: 7.5,
            description: "",
            imageUrl: "",
            inStock: true,
          },
        ],
      };
    }

    // Default not found for other network calls used here
    return { ok: false, status: 404, json: async () => ({}) };
  });
}

import { MemoryRouter } from "react-router-dom";
import App from "../App";

afterEach(() => {
  vi.restoreAllMocks();
  mockAuth = { isAdmin: true, login: vi.fn(), logout: vi.fn() };
});

describe("Routing", () => {
  it("navigates Home -> Drinks and renders the list", async () => {
    mockFetchForRouting();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    // Start on Home (adjust if your Home has a specific heading/text)
    expect(screen.getByText(/home/i)).toBeInTheDocument();

    // Click "Drinks" link in NavBar
    fireEvent.click(screen.getByRole("link", { name: /drinks/i }));

    await waitFor(() => {
      expect(screen.getByText(/The Stone Flagon’s Menu/i)).toBeInTheDocument();
    });
    expect(screen.getAllByText(/^Ale$/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/^Stout$/i)[0]).toBeInTheDocument();
  });

  it("navigates to Add New Drink when admin", async () => {
    mockFetchForRouting();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    // As admin, "Add New Drink" should be visible & clickable
    fireEvent.click(screen.getByRole("link", { name: /add new drink/i }));

    // New Drink page should render—adjust to your page’s heading text
    await waitFor(() => {
      expect(screen.getByText(/add a new drink/i)).toBeInTheDocument();
    });
  });

  it("hides Add New Drink when not admin", () => {
    mockAuth.isAdmin = false;
    mockFetchForRouting();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    // Should not see link
    expect(screen.queryByRole("link", { name: /add new drink/i })).toBeNull();
  });
});
