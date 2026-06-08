const API_BASE_URL = "https://systemprevention.onrender.com/api";
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let mensagem = "Erro ao se comunicar com a API.";

    try {
      const erro = await response.json();
      mensagem = erro.message || erro.error || mensagem;
    } catch (e) {
      mensagem = "Erro inesperado na API.";
    }

    throw new Error(mensagem);
  }

  return response.json();
}

async function loginUsuario(dados) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(dados)
  });
}

async function cadastrarUsuario(dados) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(dados)
  });
}