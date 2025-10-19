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
    // default: not expected in this test
    return { ok: false, status: 404, json: async () => ({}) };
  });
}

describe("NewDrink - Create", () => {
  it("submits the form and POSTs a new drink, then navigates to /drinks", async () => {
    // Arrange
    mockFetchForCreate();

    // Act: render the page
    renderWithProviders(<NewDrink />, { route: "/drinks/new" });

    // Fill fields (labels should match your component)
    fireEvent.change(screen.getByLabelText(/drink name/i), {
      target: { value: "Porter" },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "6.25" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Roasty and smooth" },
    });
    fireEvent.change(screen.getByLabelText(/image url/i), {
      target: { value: "https://example.com/porter.png" },
    });
    // checkbox
    const stock = screen.getByLabelText(/inStock/i);
    fireEvent.click(stock); // toggles from false -> true

    // Submit (button text should match your component)
    fireEvent.click(screen.getByRole("button", { name: /add drink/i }));

    // Assert: fetch was called once with POST to /drinks
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    const [calledUrl, calledOptions] = global.fetch.mock.calls[0];
    expect(String(calledUrl)).toMatch(/\/drinks$/);
    expect(calledOptions.method).toBe("POST");
    expect(calledOptions.headers["Content-Type"]).toBe("application/json");

    const payload = JSON.parse(calledOptions.body);
    // Your NewDrink uses image_url (snake_case). Adjust if you changed it.
    expect(payload).toMatchObject({
      name: "Porter",
      price: 6.25, // your component does parseFloat(price)
      description: "Roasty and smooth",
      image_url: "https://example.com/porter.png",
      inStock: true,
    });

    // Assert: navigated back to /drinks
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/drinks");
    });
  });
});
