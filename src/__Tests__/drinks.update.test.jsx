import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, afterEach, vi, expect } from "vitest";

// --- 1) Mocks: router + auth -----------------------------------------------

// mock useNavigate + useParams
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (orig) => {
  const actual = await orig();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
  };
});

// mock auth so the form is editable (admin)
vi.mock("../auth/useAuth", () => ({
  useAuth: () => ({ isAdmin: true, login: vi.fn(), logout: vi.fn() }),
}));

// --- 2) Import after mocks
import DrinkDetail from "../pages/DrinkDetail";

// --- 3) Test data + fetch mock helpers --------------------------------------
const START_DRINK = {
  id: 1,
  name: "Ale",
  price: 5,
  description: "A refreshing pint of ale.",
  imageUrl: "",
  inStock: true,
};

function mockFetchForUpdate({ start = START_DRINK } = {}) {
  // First call: GET /drinks/1
  // Second call: PATCH /drinks/1
  let call = 0;
  global.fetch = vi.fn().mockImplementation(async (url, options = {}) => {
    call++;

    // PATCH update
    if (/\/drinks\/1$/.test(String(url)) && options.method === "PATCH") {
      const body = JSON.parse(options.body);
      return {
        ok: true,
        status: 200,
        json: async () => ({ ...start, ...body }),
      };
    }

    // Initial GET
    if (/\/drinks\/1$/.test(String(url))) {
      return { ok: true, status: 200, json: async () => start };
    }

    return { ok: false, status: 404, json: async () => ({}) };
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  mockNavigate.mockReset();
});

// --- 4) The test -------------------------------------------------------------
describe("DrinkDetail - Update", () => {
  it("PATCHes the updated drink and navigates back to /drinks/1", async () => {
    mockFetchForUpdate();

    // Render at /drinks/1
    render(
      <MemoryRouter initialEntries={["/drinks/1"]}>
        <DrinkDetail />
      </MemoryRouter>
    );

    // Wait for the form to be populated from GET
    await waitFor(() =>
      expect(screen.getByDisplayValue("Ale")).toBeInTheDocument()
    );

    // Change a couple fields
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "5.50" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Crisp and bright" },
    });

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    // Assert: exactly one PATCH /drinks/1 happened
    await waitFor(() => {
      const patchCalls = global.fetch.mock.calls.filter(
        ([url, opts]) =>
          /\/drinks\/1$/.test(String(url)) && opts?.method === "PATCH"
      );
      expect(patchCalls).toHaveLength(1);
    });

    // Inspect that PATCH call
    const [[calledUrl, calledOptions]] = global.fetch.mock.calls.filter(
      ([url, opts]) =>
        /\/drinks\/1$/.test(String(url)) && opts?.method === "PATCH"
    );

    expect(calledOptions.headers["Content-Type"]).toBe("application/json");
    const payload = JSON.parse(calledOptions.body);

    expect(payload).toMatchObject({
      // unchanged fields can be omitted — focus on what you edited:
      price: 5.5,
      description: "Crisp and bright",
    });

    // Navigated back to /drinks/1
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/drinks/1");
    });
  });
});
