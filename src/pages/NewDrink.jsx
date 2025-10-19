import DrinkForm from "../components/DrinkForm";
import { API } from "../config";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function NewDrink() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAddDrink = (newDrink) => {
    setLoading(true);
    fetch(`${API}/drinks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newDrink, price: parseFloat(newDrink.price) }), // ensure price is a number
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to add drink");
        return r.json();
      })
      .then(() => navigate("/drinks"))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h2>Add a New Drink</h2>
      {loading && <p>saving...</p>}
      <DrinkForm onSubmit={handleAddDrink} />
    </div>
  );
}

export default NewDrink;
