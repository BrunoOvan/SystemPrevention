async function buscarResumoDashboard() {
  return apiRequest("/dashboard/resumo", {
    method: "GET"
  });
}

async function buscarTiposGolpeDashboard() {
  return apiRequest("/dashboard/tipos-golpe", {
    method: "GET"
  });
}

async function buscarCanaisDashboard() {
  return apiRequest("/dashboard/canais", {
    method: "GET"
  });
}

async function buscarStatusDashboard() {
  return apiRequest("/dashboard/status", {
    method: "GET"
  });
}

async function buscarMensalDashboard() {
  return apiRequest("/dashboard/mensal", {
    method: "GET"
  });
}