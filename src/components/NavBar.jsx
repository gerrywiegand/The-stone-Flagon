import react from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/drinks">Drinks</NavLink>
      <NavLink to="/new-drink">Add New Drink</NavLink>
    </nav>
  );
}

export default NavBar;
