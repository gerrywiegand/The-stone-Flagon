// src/__Tests__/auth.test.jsx
import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// --- Mock Auth (mutable) BEFORE importing NavBar ---
let mockAuth = {
  isAdmin: false,
  login: vi.fn(),
  logout: vi.fn(),
};

vi.mock("../auth/AuthContext.jsx", () => ({
  useAuth: () => mockAuth,
  AuthProvider: ({ children }) => <>{children}</>,
}));

import { MemoryRouter } from "react-router-dom";
import NavBar from "../components/NavBar";

afterEach(() => {
  // reset between tests
  mockAuth = { isAdmin: false, login: vi.fn(), logout: vi.fn() };
});

describe("Auth - NavBar visibility by role", () => {
  it("when logged OUT: hides Add New Drink and shows Login", () => {
    mockAuth.isAdmin = false; // logged out / not admin

    render(
      <MemoryRouter initialEntries={["/"]}>
        <NavBar />
      </MemoryRouter>
    );

    // "Add New Drink" should be hidden
    expect(screen.queryByRole("link", { name: /add new drink/i })).toBeNull();

    // You may have a Login control or label—adjust to your NavBar’s wording:
    // If you show a "Login" button/link:
    const loginText =
      screen.queryByRole("button", { name: /login/i }) ||
      screen.queryByRole("link", { name: /login/i }) ||
      screen.queryByText(/login/i);
    expect(loginText).not.toBeNull();
  });

  it("when logged IN as admin: shows Add New Drink and Logout", () => {
    mockAuth.isAdmin = true; // admin

    render(
      <MemoryRouter initialEntries={["/"]}>
        <NavBar />
      </MemoryRouter>
    );

    // “Add New Drink” should be visible
    expect(
      screen.getByRole("link", { name: /add new drink/i })
    ).toBeInTheDocument();

    const logoutText =
      screen.queryByRole("button", { name: /logout/i }) ||
      screen.queryByRole("link", { name: /logout/i }) ||
      screen.queryByText(/logout/i);
    expect(logoutText).not.toBeNull();
  });
});
