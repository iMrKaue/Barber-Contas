// frontend/js/api.js
const API_BASE = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://barber-contas.onrender.com";

  function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem("token");
  
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    };
  
    return fetch(`${API_BASE}${endpoint}`, { ...options, headers })
      .then(async (res) => {
        // Se a API caiu/dormiu e começou a responder 500/502
        if (res.status === 502 || res.status === 503 || res.status === 504) {
          console.warn("Servidor acordando... tentando novamente em 2s...");
          await new Promise(r => setTimeout(r, 2000));
          return apiFetch(endpoint, options); // tenta de novo
        }
  
        // ⚠️ Se token expirou
        if (res.status === 401) {
          localStorage.removeItem("token");
  
          // Mensagem de sessão expirada
          alert("Sua sessão expirou. Faça login novamente."); 
  
          // Redireciona para o login
          window.location.href = "/login.html";
          return;
        }
  
        if (!res.ok) {
          let errorText = await res.text();
          throw new Error(errorText || `Erro ${res.status}`);
        }
  
        // Se backend acordou agora e respondeu devagar
        return res.json();
      })
      .catch(error => {
        if (error.message.includes("Failed to fetch")) {
          console.error("Erro de conexão: backend offline ou dormindo.");
          alert("Falha ao conectar ao servidor. Tente novamente em alguns segundos.");
        }
        throw error;
      });
  }
  