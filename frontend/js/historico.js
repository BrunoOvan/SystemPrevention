document.addEventListener("DOMContentLoaded", () => {
  carregarHistorico();
});

let denunciasCarregadas = [];

async function carregarHistorico() {
  const emptyTable = document.querySelector(".empty-table");

  try {
    mostrarToast("Carregando histórico...", "info");

    denunciasCarregadas = await listarMinhasDenuncias();

    if (!denunciasCarregadas || denunciasCarregadas.length === 0) {
      mostrarEstadoHistorico(
        "inbox",
        "Nenhuma denúncia encontrada",
        "Quando houver denúncias registradas, elas aparecerão aqui.",
        "neutro"
      );
      return;
    }

    renderizarTabelaHistorico(denunciasCarregadas);
    configurarFiltrosHistorico();

    mostrarToast("Histórico carregado com sucesso.", "sucesso");
  } catch (error) {
    console.error("Erro ao carregar histórico:", error);

    if (emptyTable) {
      mostrarEstadoHistorico(
        "circle-alert",
        "Erro ao carregar histórico",
        "Não foi possível buscar as denúncias no backend. Verifique se a API está rodando.",
        "erro"
      );
    }

    mostrarToast("Erro ao carregar histórico.", "erro");
  }
}

function configurarFiltrosHistorico() {
  const protocoloInput = document.getElementById("protocolo");
  const statusSelect = document.getElementById("status");
  const tipoGolpeSelect = document.getElementById("tipoGolpe");
  const limparButton = document.querySelector(".outline-button");

  if (!protocoloInput || !statusSelect || !tipoGolpeSelect || !limparButton) {
    console.error("Elementos de filtro do histórico não encontrados.");
    return;
  }

  protocoloInput.addEventListener("input", aplicarFiltrosHistorico);
  statusSelect.addEventListener("change", aplicarFiltrosHistorico);
  tipoGolpeSelect.addEventListener("change", aplicarFiltrosHistorico);

  limparButton.addEventListener("click", () => {
    protocoloInput.value = "";
    statusSelect.value = "";
    tipoGolpeSelect.value = "";

    renderizarTabelaHistorico(denunciasCarregadas);
    mostrarToast("Filtros limpos.", "info");
  });
}

function aplicarFiltrosHistorico() {
  const protocolo = document.getElementById("protocolo").value.trim().toUpperCase();
  const status = document.getElementById("status").value;
  const tipoGolpe = document.getElementById("tipoGolpe").value;

  let resultado = [...denunciasCarregadas];

  if (protocolo) {
    resultado = resultado.filter((denuncia) =>
      denuncia.protocolo.toUpperCase().includes(protocolo)
    );
  }

  if (status) {
    resultado = resultado.filter((denuncia) => denuncia.status === status);
  }

  if (tipoGolpe) {
    resultado = resultado.filter((denuncia) => denuncia.tipoGolpe === tipoGolpe);
  }

  if (resultado.length === 0) {
    mostrarEstadoHistorico(
      "search-x",
      "Nenhum resultado encontrado",
      "Nenhuma denúncia corresponde aos filtros selecionados.",
      "neutro"
    );
    return;
  }

  renderizarTabelaHistorico(resultado);
}

function renderizarTabelaHistorico(denuncias) {
  const tableCard = document.querySelector(".table-card");

  if (!tableCard) return;

  tableCard.innerHTML = `
    <div class="table-header">
      <h3>Registros encontrados</h3>
      <span>${denuncias.length} denúncia(s) carregada(s)</span>
    </div>

    <div class="history-table-wrapper">
      <table class="history-table">
        <thead>
          <tr>
            <th>Protocolo</th>
            <th>Data</th>
            <th>Tipo de golpe</th>
            <th>Canal</th>
            <th>Nível de risco</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          ${denuncias.map((denuncia) => `
            <tr>
              <td>${denuncia.protocolo}</td>
              <td>${formatarDataCurta(denuncia.criadoEm)}</td>
              <td>${formatarTexto(denuncia.tipoGolpe)}</td>
              <td>${formatarTexto(denuncia.canal)}</td>
              <td>
                <span class="badge-risk ${denuncia.nivelRisco.toLowerCase()}">
                  ${formatarTexto(denuncia.nivelRisco)}
                </span>
              </td>
              <td>
                <span class="badge-status ${denuncia.status.toLowerCase()}">
                  ${formatarTexto(denuncia.status)}
                </span>
              </td>
              <td>
                <a class="table-action" href="acompanhar.html?protocolo=${denuncia.protocolo}">
                  Ver detalhes
                </a>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function mostrarEstadoHistorico(icone, titulo, texto, tipo) {
  const tableCard = document.querySelector(".table-card");

  if (!tableCard) return;

  tableCard.innerHTML = `
    <div class="table-header">
      <h3>Registros encontrados</h3>
      <span>Aguardando integração com o backend</span>
    </div>

    <div class="empty-table ${tipo === "erro" ? "error-state" : ""}">
      <i data-lucide="${icone}"></i>
      <h4>${titulo}</h4>
      <p>${texto}</p>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function formatarTexto(valor) {
  if (!valor) return "Não informado";

  return valor
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, letra => letra.toUpperCase());
}

function formatarDataCurta(data) {
  if (!data) return "-";

  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}