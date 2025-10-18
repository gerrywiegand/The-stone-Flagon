import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config";

function NewDrink() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [inStock, setInStock] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(`${API}/drinks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        price: parseFloat(price) || 0,
        description: description,
        image_url: image_url,
        inStock: inStock,
      }),
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error("Network response was not ok");
        }
        return r.json();
      })
      .then((data) => {
        console.log("Drink added:", data);
        navigate("/drinks");
      })
      .catch((error) => console.error("Error adding drink:", error));
  };

  return (
    <div>
      <h2>Drinks Index Page</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Drink Name:
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Price:
          <input
            type="number"
            name="price"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <br />
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <br />
        <label>
          Image URL:
          <input
            type="text"
            name="image_url"
            value={image_url}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </label>
        <br />
        <label>
          inStock:
          <input
            type="checkbox"
            name="inStock"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
        </label>
        <br />
        <button type="submit">Add Drink</button>
      </form>
    </div>
  );
}

export default NewDrink;
