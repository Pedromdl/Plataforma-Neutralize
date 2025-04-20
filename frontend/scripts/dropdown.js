export function atualizarDropdown(resultadoBusca, pacientes, inputBusca) {
    resultadoBusca.innerHTML = ""; // Limpa os resultados anteriores

    if (pacientes.length > 0) {
        resultadoBusca.style.display = "block";
        pacientes.forEach(paciente => {
            const li = document.createElement("li");
            li.textContent = `${paciente.nome} (${paciente.cpf || "CPF não informado"})`;
            li.classList.add("dropdown-item");
            li.addEventListener("click", () => {
                inputBusca.value = paciente.nome; // Preenche o campo com o nome selecionado
                resultadoBusca.style.display = "none"; // Esconde o dropdown
            });
            resultadoBusca.appendChild(li);
        });
    } else {
        resultadoBusca.style.display = "none";
    }
}

export function esconderDropdown(resultadoBusca) {
    resultadoBusca.style.display = "none";
}

export function initDropdownHandler() {
    const inputBusca = document.getElementById("busca");
    const resultadoBusca = document.getElementById("resultadoBusca");

    document.addEventListener("click", (e) => {
        if (!resultadoBusca.contains(e.target) && e.target !== inputBusca) {
            resultadoBusca.style.display = "none";
        }
    });
}