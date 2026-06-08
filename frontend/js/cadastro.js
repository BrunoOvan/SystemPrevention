document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#cadastroForm");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.querySelector("#cadastroNome").value.trim();
    const email = document.querySelector("#cadastroEmail").value.trim();
    const senha = document.querySelector("#cadastroSenha").value.trim();

    if (!nome || !email || !senha) {
      mostrarToast("Preencha todos os campos.", "erro");
      return;
    }

    if (senha.length < 6) {
      mostrarToast("A senha deve ter no mínimo 6 caracteres.", "erro");
      return;
    }

    try {
      const resposta = await cadastrarUsuario({
        nome,
        email,
        senha
      });

      localStorage.setItem("token", resposta.token);
      localStorage.setItem("usuarioNome", resposta.nome);
      localStorage.setItem("usuarioEmail", resposta.email);

      mostrarToast("Cadastro realizado com sucesso.", "sucesso");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 700);
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      mostrarToast(error.message || "Erro ao cadastrar usuário.", "erro");
    }
  });
});