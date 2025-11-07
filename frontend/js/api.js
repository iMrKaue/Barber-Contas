// frontend/js/api.js
const API_BASE = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://barber-contas.onrender.com";

function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers
  };

  return fetch(`${API_BASE}${endpoint}`, { ...options, headers })
    .then(res => res.json());
}
