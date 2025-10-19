import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Header() {
  const { isAdmin, setIsAdmin } = useAuth();

  const toggleAuth = () => setIsAdmin((prev) => !prev);

  return (
    <header className="site-header">
      {/* Top bar */}
      <div className="topbar">
        <div className="topbar-left">
          <NavLink to="/" className="navlink">
            Home
          </NavLink>
        </div>

        <div className="topbar-right">
          <button className="btn" onClick={toggleAuth}>
            {isAdmin ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      {/* Center title */}
      <h1 className="site-title">The Stone Flagon</h1>

      {/* Subnav under the title */}
      <nav className="subnav">
        <NavLink
          to="/drinks"
          className={({ isActive }) => `navlink ${isActive ? "active" : ""}`}
        >
          Drinks
        </NavLink>
        <span className="divider">|</span>
        <NavLink
          to="/drinks/new"
          className={({ isActive }) => `navlink ${isActive ? "active" : ""}`}
        >
          Add New Drink
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
