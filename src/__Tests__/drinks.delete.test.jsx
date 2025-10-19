// src/__Tests__/drinks.delete.test.jsx
import React from "react";
import { describe, it, afterEach, vi, expect } from "vitest";

// --- Router mock MUST be declared before imports using react-router-dom ---
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (orig) => {
  const actual = await orig();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
    MemoryRouter: actual.MemoryRouter,
  };
});

// --- Auth mock: path must match your DrinkDetail import exactly ---
vi.mock("../auth/AuthContext.jsx", () => ({
  useAuth: () => ({ isAdmin: true, login: vi.fn(), logout: vi.fn() }),
  AuthProvider: ({ children }) => <>{children}</>,
}));

// Now import test utils and component
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DrinkDetail from "../pages/DrinkDetail";

// --- Fixtures & fetch mock helper ---
const START_DRINK = {
  id: 1,
  name: "Ale",
  price: 5,
  description: "A refreshing pint of ale.",
  inStock: true,
};

function mockFetchForDelete({ start = START_DRINK } = {}) {
  global.fetch = vi.fn().mockImplementation(async (url, options = {}) => {
    const href = String(url);

    // DELETE /drinks/1
    if (/\/drinks\/1$/.test(href) && options.method === "DELETE") {
      return { ok: true, status: 200, json: async () => ({}) };
    }

    // GET /drinks/1
    if (/\/drinks\/1$/.test(href) && !options.method) {
      return { ok: true, status: 200, json: async () => start };
    }

    return { ok: false, status: 404, json: async () => ({}) };
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  mockNavigate.mockReset();
});

describe("DrinkDetail - Delete", () => {
  it("DELETEs the drink and navigates back to /drinks", async () => {
    mockFetchForDelete();

    // Render detail page at /drinks/1
    render(
      <MemoryRouter initialEntries={["/drinks/1"]}>
        <DrinkDetail />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("Ale")).toBeInTheDocument();
    });

    // Mock confirm() to return true so delete proceeds
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    // Click Delete
    fireEvent.click(screen.getByRole("button", { name: /delete drink/i }));

    // Assert: exactly one DELETE /drinks/1 happened
    await waitFor(() => {
      const delCalls = global.fetch.mock.calls.filter(
        ([url, opts]) =>
          /\/drinks\/1$/.test(String(url)) && opts?.method === "DELETE"
      );
      expect(delCalls).toHaveLength(1);
    });

    // Optional: ensure confirm dialog was used
    expect(confirmSpy).toHaveBeenCalled();

    // Assert redirect (adjust if your component doesn't navigate)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/drinks");
    });
  });
});
