import { createContext, useContext, useEffect, useState } from "react";
// AuthContext to provide authentication state and actions
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(
    () => JSON.parse(localStorage.getItem("isAdmin")) || false // default to false
  );

  useEffect(() => {
    localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
  }, [isAdmin]);

  const login = () => setIsAdmin(true);
  const logout = () => setIsAdmin(false);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { AuthProvider, useAuth };
