function protegerPagina() {
  const token = localStorage.getItem("token");

  if (!token) {
    mostrarTelaAcessoRestrito();
    return false;
  }

  return true;
}

function mostrarTelaAcessoRestrito() {
  const mainContent = document.querySelector(".main-content");

  if (!mainContent) {
    window.location.href = "login.html";
    return;
  }

  mainContent.innerHTML = `
    <section class="access-denied">
      <div class="access-denied-icon">
        <i data-lucide="lock-keyhole"></i>
      </div>

      <h1>Acesso restrito</h1>

      <p>
        Para acessar esta funcionalidade, é necessário fazer login na sua conta.
      </p>

      <div class="access-denied-actions">
        <a href="login.html" class="primary-link">
          <i data-lucide="log-in"></i>
          Fazer login
        </a>

        <a href="index.html" class="secondary-link">
          <i data-lucide="home"></i>
          Voltar para início
        </a>
      </div>
    </section>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}