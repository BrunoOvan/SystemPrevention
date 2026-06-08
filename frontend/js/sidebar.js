const dicasPrevencao = [
  "Não informe senhas ou códigos.",
  "Evite clicar em links suspeitos.",
  "Confirme sempre os canais oficiais.",
  "Desconfie de mensagens com urgência.",
  "Nunca envie Pix para desconhecidos.",
  "Não compartilhe token bancário.",
  "Verifique o remetente do e-mail.",
  "Não instale aplicativos por links recebidos.",
  "Desconfie de promessas de dinheiro fácil.",
  "Nunca passe dados bancários por telefone.",
  "Confira boletos antes de pagar.",
  "Use apenas aplicativos oficiais.",
  "Não envie fotos de documentos por mensagens.",
  "Desconfie de ligações dizendo ser do banco.",
  "Antes de pagar, confirme a origem da cobrança."
];

function sortearDicas(quantidade = 3) {
  return [...dicasPrevencao]
    .sort(() => Math.random() - 0.5)
    .slice(0, quantidade);
}

function carregarSidebar(paginaAtiva) {
  const sidebar = document.querySelector(".sidebar");

  if (!sidebar) return;

  const dicasSorteadas = sortearDicas(3);

  const logado = !!localStorage.getItem("token");
  const usuarioNome = localStorage.getItem("usuarioNome") || "Usuário";
  const usuarioEmail = localStorage.getItem("usuarioEmail") || "";

  sidebar.innerHTML = `
    <div class="brand">
      <i data-lucide="shield"></i>
      <span>SystemPrevention</span>
    </div>

    <nav class="menu">
      <a href="index.html" class="${paginaAtiva === "inicio" ? "active" : ""}">
        <i data-lucide="home"></i>
        <span>Início</span>
      </a>

      <a href="relatar.html" class="${paginaAtiva === "relatar" ? "active" : ""}">
        <i data-lucide="message-square-warning"></i>
        <span>Relatar Golpe</span>
      </a>

      <a href="acompanhar.html" class="${paginaAtiva === "acompanhar" ? "active" : ""}">
        <i data-lucide="search-check"></i>
        <span>Acompanhar Denúncia</span>
      </a>

      <a href="dashboard.html" class="${paginaAtiva === "dashboard" ? "active" : ""}">
        <i data-lucide="bar-chart-3"></i>
        <span>Dashboard / Estatísticas</span>
      </a>

      <a href="historico.html" class="${paginaAtiva === "historico" ? "active" : ""}">
        <i data-lucide="clock-3"></i>
        <span>Histórico</span>
      </a>
      <a href="duvidas.html" class="${paginaAtiva === "duvidas" ? "active" : ""}">
      <i data-lucide="circle-help"></i>
      <span>Dúvidas / FAQ</span>
      </a>

      <a href="login.html" class="${paginaAtiva === "login" ? "active" : ""}">
        <i data-lucide="user"></i>
        <span>Login / Cadastro</span>
      </a>
    </nav>

    <div class="sidebar-tips">
      <h3>Dicas de prevenção</h3>

      ${dicasSorteadas.map(dica => `
        <div class="tip-item">
          <i data-lucide="check-circle"></i>
          <span>${dica}</span>
        </div>
      `).join("")}
    </div>

    ${logado ? `
      <div class="sidebar-user-card">
        <div class="sidebar-user-avatar">
          <i data-lucide="user-check"></i>
        </div>

        <div class="sidebar-user-info">
          <span>Perfil logado</span>
          <h3>${escaparHtmlSidebar(usuarioNome)}</h3>
          <p>${escaparHtmlSidebar(usuarioEmail)}</p>
        </div>

        <div class="sidebar-user-status">
          <i data-lucide="shield-check"></i>
          <span>Conta ativa</span>
        </div>

        <a class="sidebar-profile-link" href="historico.html">
          <i data-lucide="clock-3"></i>
          Ver histórico
        </a>

        <button type="button" id="logoutButton">
          <i data-lucide="log-out"></i>
          Sair
        </button>
      </div>
    ` : `
      <div class="sidebar-card">
        <i data-lucide="shield-alert"></i>
        <h3>Juntos contra os golpes</h3>
        <p>Sua denúncia ajuda a proteger outras pessoas.</p>
        <a href="login.html">Fazer login →</a>
      </div>
    `}
  `;

  if (window.lucide) {
    lucide.createIcons();
  }

  const logoutButton = document.getElementById("logoutButton");

  if (logoutButton) {
    logoutButton.addEventListener("click", logoutUsuario);
  }
}

function logoutUsuario() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuarioNome");
  localStorage.removeItem("usuarioEmail");

  if (typeof mostrarToast === "function") {
    mostrarToast("Você saiu da sua conta.", "info");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 600);
  } else {
    window.location.href = "index.html";
  }
}

function escaparHtmlSidebar(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}