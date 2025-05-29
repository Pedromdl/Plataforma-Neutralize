export function initSearch(chartsManager) {
  const inputBusca = document.getElementById("busca");
  const resultadoBusca = document.getElementById("resultadoBusca");

  inputBusca.addEventListener("input", async () => {
    const query = inputBusca.value.trim();
    resultadoBusca.innerHTML = "";

    if (query.length > 1) {
      try {
        const response = await fetch(`${API_BASE_URL}/buscar-pacientes/?search=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Erro ao buscar pacientes");

        const pacientes = await response.json();
        if (pacientes.length > 0) {
          resultadoBusca.style.display = "block";
          pacientes.forEach(paciente => {
            const li = document.createElement("li");
            li.textContent = `${paciente.nome} (${paciente.cpf || "CPF não informado"})`;
            li.classList.add("dropdown-item");
            li.addEventListener("click", () => {
              inputBusca.value = paciente.nome;
              resultadoBusca.style.display = "none";
            });
            resultadoBusca.appendChild(li);
          });
        } else {
          resultadoBusca.style.display = "none";
        }
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
        resultadoBusca.style.display = "none";
      }
    } else {
      resultadoBusca.style.display = "none";
    }
  });
}