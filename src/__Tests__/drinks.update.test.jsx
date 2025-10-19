import React from "react";
import { describe, it, afterEach, vi, expect } from "vitest";

// --- Router mock MUST be declared before imports that use react-router-dom ---
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

// --- Auth mock:
vi.mock("../auth/AuthContext.jsx", () => ({
  useAuth: () => ({ isAdmin: true, login: vi.fn(), logout: vi.fn() }),
  AuthProvider: ({ children }) => <>{children}</>,
}));

// --- Now import test utils and component (AFTER mocks above) ---
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DrinkDetail from "../pages/DrinkDetail";

// --- Fixtures & fetch mock helper ---
const START_DRINK = {
  id: 1,
  name: "Ale",
  price: 5,
  description: "Crisp and bright",
  imageUrl: "",
  inStock: true,
};

function mockFetchForUpdate({ start = START_DRINK } = {}) {
  global.fetch = vi.fn().mockImplementation(async (url, options = {}) => {
    const href = String(url);

    // PATCH /drinks/1
    if (/\/drinks\/1$/.test(href) && options.method === "PATCH") {
      const body = JSON.parse(options.body);
      return {
        ok: true,
        status: 200,
        json: async () => ({ ...start, ...body }),
      };
    }

    // GET /drinks/1
    if (/\/drinks\/1$/.test(href) && !options.method) {
      return {
        ok: true,
        status: 200,
        json: async () => start,
      };
    }

    return { ok: false, status: 404, json: async () => ({}) };
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  mockNavigate.mockReset();
});

describe("DrinkDetail - Update", () => {
  it("prefills from GET, PATCHes edited fields, and shows updated values", async () => {
    mockFetchForUpdate();

    // Render detail page at /drinks/1
    render(
      <MemoryRouter initialEntries={["/drinks/1"]}>
        <DrinkDetail />
      </MemoryRouter>
    );

    // Prefill visible
    await waitFor(() => {
      expect(screen.getByLabelText(/price/i)).toHaveValue(5); // number input
      expect(screen.getByLabelText(/description/i)).toHaveValue(
        "Crisp and bright"
      );
    });
    // Price and description from GET
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Crisp and bright")).toBeInTheDocument();

    // Edit fields
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Crisp and bright" },
    });

    // Save (submits PATCH)
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    // Assert: exactly one PATCH /drinks/1 happened
    await waitFor(() => {
      const patchCalls = global.fetch.mock.calls.filter(
        ([url, opts]) =>
          /\/drinks\/1$/.test(String(url)) && opts?.method === "PATCH"
      );
      expect(patchCalls).toHaveLength(1);
    });

    // Inspect PATCH payload
    const [[patchUrl, patchOpts]] = global.fetch.mock.calls.filter(
      ([url, opts]) =>
        /\/drinks\/1$/.test(String(url)) && opts?.method === "PATCH"
    );

    expect(patchOpts.headers["Content-Type"]).toBe("application/json");
    const payload = JSON.parse(patchOpts.body);
    expect(payload).toMatchObject({
      price: 5,
      description: "Crisp and bright",
    });

    // UI reflects updated values
    await waitFor(() => {
      expect(screen.getByDisplayValue("5")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Crisp and bright")).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
