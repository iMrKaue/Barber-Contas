// toast.js — Sistema de notificações toast moderno e completo

// Container para os toasts (criado uma vez)
let toastContainer = null;

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

// Ícones por tipo
const icons = {
  sucesso: "✅",
  erro: "❌",
  info: "ℹ️",
  alerta: "⚠️"
};

/**
 * Exibe uma notificação toast
 * @param {string} mensagem - Mensagem a ser exibida
 * @param {string} tipo - Tipo do toast: "sucesso", "erro", "info", "alerta"
 * @param {number} duracao - Duração em milissegundos (padrão: 3000)
 */
function showToast(mensagem, tipo = "sucesso", duracao = 3000) {
  const container = getToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast ${tipo}`;
  
  // Adiciona ícone e mensagem
  toast.innerHTML = `
    <span class="toast-icon">${icons[tipo] || icons.info}</span>
    <span class="toast-message">${mensagem}</span>
    <button class="toast-close">×</button>
  `;
  
  container.appendChild(toast);
  
  // Animação de entrada
  setTimeout(() => toast.classList.add("show"), 10);
  
  let timeoutId = null;
  
  const removeToast = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 300);
  };
  
  // Adiciona evento ao botão de fechar
  const closeBtn = toast.querySelector(".toast-close");
  closeBtn.addEventListener("click", removeToast);
  
  // Inicia o timeout para remover
  const startTimeout = () => {
    timeoutId = setTimeout(removeToast, duracao);
  };
  
  // Pausa o timeout ao passar o mouse
  toast.addEventListener("mouseenter", () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  });
  
  // Retoma o timeout ao sair o mouse
  toast.addEventListener("mouseleave", () => {
    if (!timeoutId) {
      startTimeout();
    }
  });
  
  // Inicia o timeout inicial
  startTimeout();
}

// Funções de conveniência
function showSuccess(mensagem, duracao = 3000) {
  showToast(mensagem, "sucesso", duracao);
}

function showError(mensagem, duracao = 4000) {
  showToast(mensagem, "erro", duracao);
}

function showInfo(mensagem, duracao = 3000) {
  showToast(mensagem, "info", duracao);
}

function showWarning(mensagem, duracao = 3500) {
  showToast(mensagem, "alerta", duracao);
}
  