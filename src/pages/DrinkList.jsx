import { useState, useEffect } from "react";
import { API } from "../config";
import { useNavigate } from "react-router-dom";

function DrinkList() {
  const navigate = useNavigate();
  const [drinks, setDrinks] = useState([]);
  const [drinkFilter, setDrinkFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/drinks`)
      .then((r) => {
        if (!r.ok) throw new Error("Network response was not ok");
        return r.json();
      })
      .then((data) => {
        setDrinks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching drinks:", err);
        setError("Failed to load drinks.");
        setLoading(false);
      });
  }, []);

  const filteredDrinks = drinks.filter((drink) =>
    drink.name.toLowerCase().includes(drinkFilter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="page">
        <div className="panel">
          <h2 className="section-title">Loading Drinks...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="panel">
          <h2 className="section-title">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page grid" style={{ gridTemplateColumns: "260px 1fr" }}>
      {/* Sidebar */}
      <aside className="panel">
        <h3 className="section-title">Filters</h3>

        <label className="sidebar-label">Search</label>
        <input
          type="text"
          placeholder="Search drinks..."
          value={drinkFilter}
          onChange={(e) => setDrinkFilter(e.target.value)}
        />

        <p style={{ marginTop: "1rem", color: "#a0a0a0" }}>
          Browse our fine dwarven brews — from crisp ales to hearty stouts.
        </p>
      </aside>

      {/* Main Content */}
      <main className="panel">
        <h2 className="section-title">The Stone Flagon’s Menu</h2>

        {filteredDrinks.length === 0 ? (
          <p style={{ color: "#a0a0a0" }}>No drinks found.</p>
        ) : (
          <ul className="cards">
            {filteredDrinks.map((drink) => (
              <li key={drink.id} className="card">
                <div className="card-title">{drink.name}</div>

                {drink.description && (
                  <>
                    <div className="card-sub">Description</div>
                    <div className="card-text">{drink.description}</div>
                  </>
                )}

                <div className="card-sub">Price</div>
                <div className="card-text">
                  ${Number(drink.price).toFixed(2)}
                </div>

                <button
                  className="btn"
                  onClick={() => navigate(`/drinks/${drink.id}`)}
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default DrinkList;
