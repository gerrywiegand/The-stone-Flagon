import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DrinkForm from "../components/DrinkForm";
import { fetchDrink, updateDrink, deleteDrink } from "../services/drinks";

function DrinkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drink, setDrink] = useState(null);
  const [error, setError] = useState("");

  // READ
  useEffect(() => {
    fetchDrink(id)
      .then((data) => setDrink(data))
      .catch((err) => {
        console.error("Error fetching drink:", err);
        setError("Could not load drink.");
        navigate("/drinks");
      });
  }, [id, navigate]);

  // UPDATE
  function handleUpdate(updated) {
    updated.price = parseFloat(updated.price) || 0;

    updateDrink(id, updated)
      .then((data) => {
        console.log("Drink updated:", data);
        setDrink(data);
      })
      .catch((err) => {
        console.error("Error updating drink:", err);
        setError("Update failed.");
      });
  }

  // DELETE
  function handleDelete() {
    if (!window.confirm("Delete this drink?")) return;

    deleteDrink(id)
      .then(() => navigate("/drinks"))
      .catch((err) => {
        console.error("Error deleting drink:", err);
        setError("Delete failed.");
      });
  }

  if (!drink) return <div>Loading...</div>;

  return (
    <div>
      <h2>Drink Detail Page</h2>
      {error && <p style={{ color: "salmon" }}>{error}</p>}
      <DrinkForm initialData={drink} onSubmit={handleUpdate} />
      <button onClick={handleDelete}>Delete Drink</button>
    </div>
  );
}

export default DrinkDetail;
