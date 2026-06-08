document.addEventListener("DOMContentLoaded", () => {
  inicializarInterface();
});

function inicializarInterface() {
  aplicarAcessibilidadeBasica();
  aplicarMascaraProtocolo();
  inicializarIcones();
}

function inicializarIcones() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

function aplicarAcessibilidadeBasica() {
  const inputs = document.querySelectorAll("input, select, textarea, button, a");

  inputs.forEach((elemento) => {
    elemento.addEventListener("focus", () => {
      elemento.classList.add("focus-visible-custom");
    });

    elemento.addEventListener("blur", () => {
      elemento.classList.remove("focus-visible-custom");
    });
  });
}

function aplicarMascaraProtocolo() {
  const camposProtocolo = document.querySelectorAll(
    "#protocolo, #protocoloConsulta"
  );

  camposProtocolo.forEach((campo) => {
    campo.addEventListener("input", () => {
      let valor = campo.value.toUpperCase();

      valor = valor.replace(/[^A-Z0-9]/g, "");

      if (valor.length > 2) {
        valor = valor.slice(0, 2) + "-" + valor.slice(2);
      }

      if (valor.length > 7) {
        valor = valor.slice(0, 7) + "-" + valor.slice(7);
      }

      campo.value = valor.slice(0, 13);
    });
  });
}

function mostrarToast(mensagem, tipo = "info") {
  const toastExistente = document.querySelector(".toast-message");

  if (toastExistente) {
    toastExistente.remove();
  }

  const toast = document.createElement("div");
  toast.className = `toast-message ${tipo}`;
  toast.textContent = mensagem;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}