import { useState } from "react";

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(
    () => JSON.parse(localStorage.getItem("isAdmin")) || false
  );

  function login() {
    setIsAdmin(true);
    localStorage.setItem("isAdmin", true);
  }

  function logout() {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  }

  return { isAdmin, login, logout };
}
