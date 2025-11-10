// frontend/js/api.js
const API_BASE = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://barber-contas.onrender.com";

function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
    ...options.headers
  };

  return fetch(`${API_BASE}${endpoint}`, { ...options, headers })
    .then(async (res) => {
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Erro na requisição' }));
        throw new Error(error.message || `Erro ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .catch(error => {
      console.error('Erro na API:', error);
      throw error;
    });
}
