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
        let errorData;
        const contentType = res.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
          try {
            errorData = await res.json();
          } catch (e) {
            errorData = { message: `Erro ${res.status}: ${res.statusText}` };
          }
        } else {
          try {
            const text = await res.text();
            errorData = { message: text || `Erro ${res.status}: ${res.statusText}` };
          } catch (e) {
            errorData = { message: `Erro ${res.status}: ${res.statusText}` };
          }
        }
        
        const errorMessage = errorData.message || errorData.error || `Erro ${res.status}: ${res.statusText}`;
        console.error(`Erro na API [${res.status}]:`, errorMessage, errorData);
        throw new Error(errorMessage);
      }
      return res.json();
    })
    .catch(error => {
      // Se for um erro de rede, fornecer mensagem mais amigável
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('Erro de conexão com a API:', error);
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      }
      console.error('Erro na API:', error);
      throw error;
    });
}
