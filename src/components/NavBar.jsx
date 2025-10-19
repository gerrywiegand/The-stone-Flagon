import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function NavBar() {
  const { isAdmin, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <nav className="nav-left">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <span className="nav-sep">|</span>
          <Link to="/drinks" className="nav-link">
            Drinks
          </Link>
          {isAdmin && (
            <>
              <span className="nav-sep">|</span>
              <Link to="/drinks/new" className="nav-link">
                Add New Drink
              </Link>
            </>
          )}
        </nav>

        <div className="nav-center" aria-hidden>
          {/* keep empty to visually center title via layout */}
        </div>

        <div className="nav-right">
          {isAdmin ? (
            <button className="btn" onClick={logout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
