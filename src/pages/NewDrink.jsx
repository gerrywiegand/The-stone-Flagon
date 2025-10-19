import DrinkForm from "../components/DrinkForm";
import { API } from "../config";
import { useNavigate } from "react-router-dom";

function NewDrink() {
  const navigate = useNavigate();

  const handleAddDrink = (newDrink) => {
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
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h2>Add a New Drink</h2>
      <DrinkForm onSubmit={handleAddDrink} />
    </div>
  );
}

export default NewDrink;
