function usuarioEstaLogado() {
  return !!localStorage.getItem("token");
}

function obterUsuarioLogado() {
  return {
    token: localStorage.getItem("token"),
    nome: localStorage.getItem("usuarioNome") || "Usuário",
    email: localStorage.getItem("usuarioEmail") || ""
  };
}

function protegerPagina() {
  if (!usuarioEstaLogado()) {
    mostrarAcessoNegado();
    return false;
  }

  return true;
}

function mostrarAcessoNegado() {
  const main = document.querySelector(".main-content");

  if (!main) return;

  main.innerHTML = `
    <section class="access-denied">
      <div class="access-denied-icon">
        <i data-lucide="lock-keyhole"></i>
      </div>

      <h1>Acesso restrito</h1>

      <p>
        Para acessar esta área, você precisa entrar com sua conta.
        Faça login para registrar denúncias, acompanhar protocolos e visualizar seus registros.
      </p>

      <div class="access-denied-actions">
        <a href="login.html" class="primary-link">
          <i data-lucide="log-in"></i>
          Fazer login
        </a>

        <a href="index.html" class="secondary-link">
          <i data-lucide="home"></i>
          Voltar ao início
        </a>
      </div>
    </section>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function sair() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuarioNome");
  localStorage.removeItem("usuarioEmail");

  mostrarToast("Você saiu da sua conta.", "info");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 600);
}