import { useState, useEffect } from "react";
import { API } from "../config";
import { Outlet, useNavigate } from "react-router-dom";

function DrinkList() {
  const navigate = useNavigate();
  const [drinks, setDrinks] = useState([]);
  const [drinkFilter, setDrinkFilter] = useState("");

  const filteredDrinks = drinks.filter(
    (drink) => drink.name.toLowerCase().includes(drinkFilter.toLowerCase()) // case-insensitive match
  );

  useEffect(() => {
    fetch(`${API}/drinks`)
      .then((r) => {
        if (!r.ok) {
          throw new Error("Network response was not ok");
        }
        return r.json();
      })
      .then((data) => {
        console.log(data);
        setDrinks(data);
      })
      .catch((error) => console.error("Error fetching drinks:", error));
  }, []);

  return (
    <div>
      <h2>Drinks Index Page</h2>
      <input
        type="text"
        aria-label="Search drinks"
        placeholder="Search drinks…"
        value={drinkFilter}
        onChange={(e) => setDrinkFilter(e.target.value)}
      />
      <ul>
        {filteredDrinks.map(
          (
            drink // display filtered drinks, set price to 2 decimals
          ) => (
            <li key={drink.id}>
              {drink.name} - ${Number(drink.price).toFixed(2)}
              <button onClick={() => navigate(`/drinks/${drink.id}`)}>
                View Details
              </button>
            </li>
          )
        )}
      </ul>
      <Outlet />
    </div>
  );
}

export default DrinkList;
