import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav>
      <NavLink to="/">Home |</NavLink>
      <NavLink to="/drinks">Drinks |</NavLink>
      <NavLink to="/drinks/new">Add New Drink</NavLink>
    </nav>
  );
}

export default NavBar;
