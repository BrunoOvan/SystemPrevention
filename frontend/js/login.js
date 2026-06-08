document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#loginEmail").value.trim();
    const senha = document.querySelector("#loginSenha").value.trim();

    if (!email || !senha) {
      mostrarToast("Preencha e-mail e senha.", "erro");
      return;
    }

    try {
      const resposta = await loginUsuario({
        email,
        senha
      });

      localStorage.setItem("token", resposta.token);
      localStorage.setItem("usuarioNome", resposta.nome);
      localStorage.setItem("usuarioEmail", resposta.email);

      mostrarToast("Login realizado com sucesso.", "sucesso");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 700);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      mostrarToast(error.message || "Erro ao fazer login.", "erro");
    }
  });
});