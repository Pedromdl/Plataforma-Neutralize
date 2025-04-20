import { buscarPacientes } from './buscaPacientes.js';
import { atualizarDropdown, esconderDropdown } from './dropdown.js';

export function configurarFormulario(chartsManager) {
    const form = document.getElementById('buscarPacienteForm');
    const inputBusca = document.getElementById('busca');
    const resultadoBusca = document.getElementById('resultadoBusca');

    // Evento de envio do formulário
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const termoBusca = inputBusca.value.trim();
        console.log("Termo de busca enviado:", termoBusca);

        try {
            const response = await fetch(`${API_BASE_URL}/buscar-pacientes/?search=${encodeURIComponent(termoBusca)}`);
            if (!response.ok) {
                throw new Error("Erro ao buscar paciente");
            }

            const pacientes = await response.json();
            console.log("Dados retornados do backend:", pacientes);

            if (pacientes.length > 0) {
                const paciente = pacientes[0]; // Seleciona o primeiro paciente retornado
                chartsManager.renderAll(paciente); // Renderiza os gráficos com os dados do paciente
            } else {
                console.warn("Nenhum paciente encontrado");
            }
        } catch (error) {
            console.error("Erro ao buscar paciente:", error);
        }
    });

    // Evento de digitação no campo de busca
    inputBusca.addEventListener("input", async () => {
        const query = inputBusca.value.trim();
        if (query.length > 2) {
            try {
                const pacientes = await buscarPacientes(query);
                atualizarDropdown(resultadoBusca, pacientes, inputBusca);
            } catch (error) {
                esconderDropdown(resultadoBusca);
            }
        } else {
            esconderDropdown(resultadoBusca);
        }
    });

    // Esconde o dropdown se clicar fora
    document.addEventListener("click", (e) => {
        if (!resultadoBusca.contains(e.target) && e.target !== inputBusca) {
            esconderDropdown(resultadoBusca);
        }
    });
}