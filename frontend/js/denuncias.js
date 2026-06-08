async function registrarDenuncia(dadosDenuncia) {
  return apiRequest("/denuncias", {
    method: "POST",
    body: JSON.stringify(dadosDenuncia)
  });
}

async function buscarDenunciaPorProtocolo(protocolo) {
  return apiRequest(`/denuncias/protocolo/${protocolo}`, {
    method: "GET"
  });
}

async function listarMinhasDenuncias() {
  return apiRequest("/denuncias/minhas", {
    method: "GET"
  });
}

async function listarTodasDenuncias() {
  return apiRequest("/denuncias", {
    method: "GET"
  });
}