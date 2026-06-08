document.addEventListener("DOMContentLoaded", () => {
  carregarDashboard();
});

let chartTiposGolpe = null;
let chartCanais = null;
let chartMensal = null;

async function carregarDashboard() {
  try {
    const [resumo, status, tiposGolpe, canais, mensal] = await Promise.all([
      buscarResumoDashboard(),
      buscarStatusDashboard(),
      buscarTiposGolpeDashboard(),
      buscarCanaisDashboard(),
      buscarMensalDashboard()
    ]);

    preencherResumo(resumo);
    preencherStatus(status);
    preencherTiposGolpe(tiposGolpe);
    preencherCanais(canais);
    preencherMensal(mensal);
    preencherTendencias(resumo, tiposGolpe, canais);

  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);

    if (typeof mostrarToast === "function") {
      mostrarToast("Erro ao carregar dados do dashboard.", "erro");
    }
  }
}

function preencherResumo(resumo) {
  document.getElementById("totalDenuncias").textContent = resumo.totalDenuncias ?? 0;
  document.getElementById("casosAnalisados").textContent = resumo.casosAnalisados ?? 0;
  document.getElementById("riscoAlto").textContent = resumo.riscoAlto ?? 0;
  document.getElementById("golpeMaisRelatado").textContent = resumo.golpeMaisRelatado ?? "Nenhum registro";

  document.getElementById("variacaoTotal").textContent = "Dados reais do sistema";
  document.getElementById("variacaoAnalisados").textContent = "Denúncias concluídas";
  document.getElementById("variacaoRisco").textContent = "Risco alto ou crítico";
  document.getElementById("percentualGolpe").textContent = "Com base nas denúncias registradas";
}

function preencherStatus(statusLista) {
  const statusPendente = document.getElementById("statusPendente");
  const statusAnalise = document.getElementById("statusAnalise");
  const statusConcluido = document.getElementById("statusConcluido");

  if (!statusPendente || !statusAnalise || !statusConcluido) {
    console.error("IDs do status não encontrados no dashboard.html.");
    return;
  }

  statusPendente.textContent = buscarQuantidadePorNome(statusLista, "Pendente");
  statusAnalise.textContent = buscarQuantidadePorNome(statusLista, "Em Analise");
  statusConcluido.textContent = buscarQuantidadePorNome(statusLista, "Concluido");
}

function preencherTiposGolpe(tiposGolpe) {
  const canvas = document.getElementById("chartTiposGolpe");

  if (!canvas || typeof Chart === "undefined") return;

  const dados = tiposGolpe
    .filter((item) => item.quantidade > 0)
    .slice(0, 8);

  if (!dados.length) return;

  if (chartTiposGolpe) {
    chartTiposGolpe.destroy();
  }

  chartTiposGolpe = new Chart(canvas, {
    type: "bar",
    data: {
      labels: dados.map((item) => item.nome),
     datasets: [
  {
    label: "Quantidade",
    data: dados.map((item) => item.quantidade),
    backgroundColor: dados.map((item) => corTipoGolpe(item.nome)),
    borderColor: dados.map((item) => bordaTipoGolpe(item.nome)),
    borderWidth: 1,
    borderRadius: 8,
    barThickness: 22,
    maxBarThickness: 26
  }
]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.raw} denúncia(s)`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            color: "#111827",
            font: {
              family: "Arial",
              size: 12,
              weight: "700"
            }
          },
          grid: {
            color: "rgba(17, 24, 39, 0.08)"
          }
        },
        y: {
          ticks: {
            color: "#111827",
            font: {
              family: "Arial",
              size: 12,
              weight: "700"
            }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function preencherCanais(canais) {
  const canvas = document.getElementById("chartCanais");

  if (!canvas || typeof Chart === "undefined") return;

  const dados = canais;

  if (!dados.length) return;

  if (chartCanais) {
    chartCanais.destroy();
  }

  chartCanais = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: dados.map((item) => item.nome),
      datasets: [
        {
          data: dados.map((item) => item.quantidade),
          backgroundColor: dados.map((item) => corCanal(item.nome)),
          borderColor: "#fff",
          borderWidth: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            padding: 14,
            color: "#111827",
            font: {
              family: "Arial",
              size: 12,
              weight: "700"
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.raw} denúncia(s)`
          }
        }
      }
    }
  });
}

function preencherMensal(mensal) {
  const canvas = document.getElementById("chartMensal");

  if (!canvas || typeof Chart === "undefined") return;

  if (!mensal || !mensal.length) return;

  if (chartMensal) {
    chartMensal.destroy();
  }

  chartMensal = new Chart(canvas, {
    type: "line",
    data: {
      labels: mensal.map((item) => item.nome),
      datasets: [
        {
          label: "Denúncias",
          data: mensal.map((item) => item.quantidade),
          borderColor: "rgba(217, 4, 41, 0.9)",
          backgroundColor: "rgba(217, 4, 41, 0.08)",
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.raw} denúncia(s)`
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#4b5563",
            font: {
              weight: "700"
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            color: "#4b5563"
          }
        }
      }
    }
  });
}

function preencherTendencias(resumo, tiposGolpe, canais) {
  const container = document.getElementById("tendenciasDashboard");

  if (!container) {
    console.error("Elemento #tendenciasDashboard não encontrado.");
    return;
  }

  const totalDenuncias = Number(resumo?.totalDenuncias || 0);

  if (totalDenuncias === 0) {
    container.className = "empty-state";
    container.innerHTML = `
      <i data-lucide="activity"></i>
      <h4>Nenhuma tendência identificada</h4>
      <p>Após o registro das denúncias, o sistema poderá indicar padrões de golpes mais frequentes.</p>
    `;

    if (window.lucide) {
      lucide.createIcons();
    }

    return;
  }

  const golpeMaisFrequente = buscarMaiorItem(tiposGolpe);
  const canalMaisUtilizado = buscarMaiorItem(canais);

  const percentualRiscoAlto = calcularPercentual(resumo.riscoAlto || 0, totalDenuncias);

  const percentualGolpe = golpeMaisFrequente
    ? calcularPercentual(golpeMaisFrequente.quantidade, totalDenuncias)
    : 0;

  const percentualCanal = canalMaisUtilizado
    ? calcularPercentual(canalMaisUtilizado.quantidade, totalDenuncias)
    : 0;

  container.className = "trend-list";

  container.innerHTML = `
    <div class="trend-item">
      <div class="trend-icon">
        <i data-lucide="trending-up"></i>
      </div>

      <div>
        <strong>Golpe mais recorrente</strong>
        <p>
          ${golpeMaisFrequente ? golpeMaisFrequente.nome : "Não identificado"} representa
          <b>${percentualGolpe}%</b> das denúncias registradas.
        </p>
      </div>
    </div>

   <div class="trend-item" style="--trend-color: ${corCanalSolida(canalMaisUtilizado?.nome)};">
  <div class="trend-icon channel">
    <i data-lucide="radio-tower"></i>
  </div>

  <div>
    <strong>Canal com maior ocorrência</strong>
    <p>${canalMaisUtilizado ? canalMaisUtilizado.nome : "Não identificado"} concentra <b>${percentualCanal}%</b> das tentativas relatadas.</p>
  </div>
</div>

    <div class="trend-item">
      <div class="trend-icon danger">
        <i data-lucide="triangle-alert"></i>
      </div>

      <div>
        <strong>Atenção ao risco</strong>
        <p>
          <b>${percentualRiscoAlto}%</b> dos registros foram classificados como risco alto ou crítico.
        </p>
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function buscarMaiorItem(lista) {
  if (!lista || lista.length === 0) return null;

  return lista
    .filter((item) => item.quantidade > 0)
    .sort((a, b) => b.quantidade - a.quantidade)[0] || null;
}

function calcularPercentual(valor, total) {
  if (!total || total === 0) return 0;

  return Math.round((Number(valor) / Number(total)) * 100);
}

function buscarQuantidadePorNome(lista, nome) {
  const item = lista.find((elemento) => normalizarTexto(elemento.nome) === normalizarTexto(nome));
  return item ? item.quantidade : 0;
}

function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function corCanal(nome) {
  const canal = normalizarTexto(nome);

  if (canal === "whatsapp") return "rgba(217, 4, 41, 0.82)";
  if (canal === "ligacao") return "rgba(232, 93, 117, 0.82)";
  if (canal === "sms") return "rgba(124, 58, 237, 0.82)";
  if (canal === "email") return "rgba(249, 115, 22, 0.82)";
  if (canal === "outro" || canal === "outros") return "rgba(156, 163, 175, 0.82)";

  return "rgba(217, 4, 41, 0.82)";
}

function corCanalSolida(nome) {
  const canal = normalizarTexto(nome);

  if (canal === "whatsapp") return "#d90429";
  if (canal === "ligacao") return "#e85d75";
  if (canal === "sms") return "#7c3aed";
  if (canal === "email") return "#f97316";
  if (canal === "outro" || canal === "outros") return "#9ca3af";

  return "#d90429";
}

function corTipoGolpe(nome) {
  const tipo = normalizarTexto(nome);

  if (tipo === "outro" || tipo === "outros") return "rgba(156, 163, 175, 0.82)";
  if (tipo.includes("falso boleto")) return "rgba(232, 93, 117, 0.82)";
  if (tipo.includes("falsa central")) return "rgba(217, 4, 41, 0.78)";
  if (tipo.includes("falso alerta")) return "rgba(249, 115, 22, 0.82)";
  if (tipo.includes("bloqueio")) return "rgba(190, 18, 60, 0.72)";
  if (tipo.includes("phishing")) return "rgba(124, 58, 237, 0.78)";
  if (tipo.includes("site falso")) return "rgba(168, 85, 247, 0.72)";
  if (tipo.includes("whatsapp")) return "rgba(217, 4, 41, 0.72)";
  if (tipo.includes("compra")) return "rgba(234, 88, 12, 0.75)";
  if (tipo.includes("cartao") || tipo.includes("cartão")) return "rgba(244, 63, 94, 0.75)";
  if (tipo.includes("token") || tipo.includes("codigo") || tipo.includes("código")) return "rgba(126, 34, 206, 0.75)";
  if (tipo.includes("emprestimo") || tipo.includes("empréstimo")) return "rgba(107, 114, 128, 0.75)";

  return "rgba(217, 4, 41, 0.72)";
}

function bordaTipoGolpe(nome) {
  const tipo = normalizarTexto(nome);

  if (tipo === "outro" || tipo === "outros") return "rgba(107, 114, 128, 0.95)";
  if (tipo.includes("falso boleto")) return "rgba(190, 18, 60, 0.95)";
  if (tipo.includes("falsa central")) return "rgba(176, 0, 32, 0.95)";
  if (tipo.includes("falso alerta")) return "rgba(234, 88, 12, 0.95)";
  if (tipo.includes("bloqueio")) return "rgba(159, 18, 57, 0.95)";
  if (tipo.includes("phishing")) return "rgba(109, 40, 217, 0.95)";
  if (tipo.includes("site falso")) return "rgba(126, 34, 206, 0.95)";

  return "rgba(176, 0, 32, 0.95)";
}