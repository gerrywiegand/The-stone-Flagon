import { useState, useEffect } from "react";
import { API } from "../config";

function DrinkList() {
  const [drinks, setDrinks] = useState([]);

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
      <ul>
        {drinks.map((drink) => (
          <li key={drink.id}>
            {drink.name} - ${drink.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DrinkList;
