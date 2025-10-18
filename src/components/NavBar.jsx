import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function NavBar() {
  const { isAdmin, login, logout } = useAuth();

  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <span> | </span>
      <NavLink to="/drinks">Drinks</NavLink>
      <span> | </span>

      {isAdmin ? (
        <>
          <NavLink to="/drinks/new">Add New Drink</NavLink>
          <span> | </span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </nav>
  );
}

export default NavBar;
