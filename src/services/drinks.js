import { API } from "../config";

// Helper to check response
function checkResponse(res) {
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  return res.json ? res.json() : Promise.resolve(null);
}
// helper to fetch a single drink
export function fetchDrink(id) {
  return fetch(`${API}/drinks/${id}`).then(checkResponse);
}
// helper to update a drink
export function updateDrink(id, payload) {
  return fetch(`${API}/drinks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(checkResponse);
}
// helper to delete a drink
export function deleteDrink(id) {
  return fetch(`${API}/drinks/${id}`, { method: "DELETE" }).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return true;
  });
}
