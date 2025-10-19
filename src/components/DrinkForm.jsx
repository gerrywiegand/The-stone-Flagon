import { useEffect, useState } from "react";

const EMPTY = {
  // empty form state
  name: "",
  price: "",
  description: "",
  inStock: false,
};

export default function DrinkForm({ initialData, onSubmit, readOnly = false }) {
  // readOnly for view-only mode
  const [formData, setFormData] = useState({
    ...EMPTY,
    ...(initialData || {}),
  });

  useEffect(() => {
    // reset form if initialData changes
    setFormData(initialData || EMPTY);
  }, [initialData]);

  function handleChange(e) {
    // handle input changes
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (readOnly) return;
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Drink Name:
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={readOnly} // disable in read-only mode
        />
      </label>
      <br />

      <label>
        Price:
        <input
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
          disabled={readOnly} // disable in read-only mode
        />
      </label>
      <br />

      <label>
        Description:
        <input
          name="description"
          type="text"
          value={formData.description}
          onChange={handleChange}
          disabled={readOnly} // disable in read-only mode
        />
      </label>
      <br />

      <label>
        In Stock:
        <input
          name="inStock"
          type="checkbox"
          checked={formData.inStock}
          onChange={handleChange}
          disabled={readOnly} // disable in read-only mode
        />
      </label>
      <br />

      {!readOnly && <button type="submit">Save</button>}
    </form>
  );
}
