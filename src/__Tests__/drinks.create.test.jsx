import React from "react";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { vi, describe, it, afterEach, expect } from "vitest";
import { renderWithProviders } from "../test/setup";
import NewDrink from "../pages/NewDrink";

// 1) Mock useNavigate so we can assert redirects
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (orig) => {
  const actual = await orig();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 2) Reset mocks between tests
afterEach(() => {
  vi.restoreAllMocks();
  mockNavigate.mockReset();
});

// 3) One handy helper to mock a successful POST
function mockFetchForCreate() {
  global.fetch = vi.fn().mockImplementation(async (url, options) => {
    // mimic json-server echoing the created resource with a new id
    if (url.toString().includes("/drinks") && options?.method === "POST") {
      const body = JSON.parse(options.body);
      return {
        ok: true,
        status: 201,
        json: async () => ({ id: 99, ...body }),
      };
    }

    return { ok: false, status: 404, json: async () => ({}) };
  });
}

describe("NewDrink - Create", () => {
  it("submits the form and POSTs a new drink, then navigates to /drinks", async () => {
    // Arrange
    mockFetchForCreate();

    // render the page
    renderWithProviders(<NewDrink />, { route: "/drinks/new" });

    // Fill fields
    fireEvent.change(screen.getByLabelText(/drink name/i), {
      target: { value: "Porter" },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "6.25" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Roasty and smooth" },
    });

    // checkbox
    const stock = screen.getByLabelText(/in stock/i);
    fireEvent.click(stock); // toggle to true

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    //  fetch was called once with POST to /drinks
    // Assert: exactly one POST /drinks happened (even if others fired)
    await waitFor(() => {
      const postCalls = global.fetch.mock.calls.filter(
        ([url, opts]) =>
          String(url).match(/\/drinks$/) && opts?.method === "POST"
      );
      expect(postCalls).toHaveLength(1);
    });

    // Extract that single POST call
    const [[calledUrl, calledOptions]] = global.fetch.mock.calls.filter(
      ([url, opts]) => String(url).match(/\/drinks$/) && opts?.method === "POST"
    );

    expect(calledOptions.headers["Content-Type"]).toBe("application/json");
    const payload = JSON.parse(calledOptions.body);

    expect(payload).toMatchObject({
      name: "Porter",
      price: 6.25,
      description: "Roasty and smooth",
      inStock: true,
    });

    //  navigated back to /drinks
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/drinks");
    });
  });
});
