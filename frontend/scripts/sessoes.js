import { API_BASE_URL } from '../config.js';
    
    
    const inputBusca = document.getElementById("busca");
    const resultadoBusca = document.getElementById("resultadoBusca");
    const formBusca = document.getElementById("buscarPacienteForm");
    const listaSessoes = document.getElementById("listaSessoes");
    let pacienteSelecionado = null;

    const nomesRegioes = {
      ombro_direito: "Ombro Direito",
      ombro_esquerdo: "Ombro Esquerdo",
      cotovelo_direito: "Cotovelo Direito",
      cotovelo_esquerdo: "Cotovelo Esquerdo",
      punho_direito: "Punho Direito",
      punho_esquerdo: "Punho Esquerdo",
      tornozelo_direito: "Tornozelo Direito",
      tornozelo_esquerdo: "Tornozelo Esquerdo",
      joelho_direito: "Joelho Direito",
      joelho_esquerdo: "Joelho Esquerdo",
      quadril_direito: "Quadril Direito",
      quadril_esquerdo: "Quadril Esquerdo",
      lombar: "Lombar",
      cervical: "Cervical",
      toracica: "Torácica",
      // ...adicione todas as regiões usadas no seu sistema
    };

    // Função para converter data ISO para DD/MM/AAAA
    function formatarDataBR(dataISO) {
      if (!dataISO) return '';
      // Se vier no formato YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(dataISO)) {
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
      }
      // Se vier no formato MM/DD/YYYY
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dataISO)) {
        const [mes, dia, ano] = dataISO.split('/');
        return `${dia}/${mes}/${ano}`;
      }
      // Se vier no formato Date (objeto)
      const data = new Date(dataISO);
      if (!isNaN(data)) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
      }
      return dataISO; // fallback
    }

    // Adicione esta função antes de carregarSessoes
    function paraISO(dataBR) {
      if (!dataBR) return '';
      const [dia, mes, ano] = dataBR.split('/');
      return `${ano}-${mes}-${dia}`;
    }

    // Buscador de pacientes (igual ao painmap)
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
                pacienteSelecionado = paciente;
                carregarSessoes();
              });
              resultadoBusca.appendChild(li);
            });
          } else {
            resultadoBusca.style.display = "none";
          }
        } catch (error) {
          resultadoBusca.style.display = "none";
        }
      } else {
        resultadoBusca.style.display = "none";
      }
    });

    // Esconde o dropdown se clicar fora
    document.addEventListener("click", (e) => {
      if (!resultadoBusca.contains(e.target) && e.target !== inputBusca) {
        resultadoBusca.style.display = "none";
      }
    });

    // Filtro por data
    document.getElementById("btnFiltrar").addEventListener("click", function(e) {
      e.preventDefault();
      carregarSessoes();
    });

    // Carregar sessões do paciente selecionado
    async function carregarSessoes() {
      if (!pacienteSelecionado) {
        listaSessoes.innerHTML = "<div class='alert alert-info'>Selecione um paciente.</div>";
        return;
      }
      let url = `${API_BASE_URL}/registros-sessao/?paciente=${pacienteSelecionado.id}`;
      const dataInicio = paraISO(document.getElementById("dataInicio").value);
      const dataFim = paraISO(document.getElementById("dataFim").value);
      if (dataInicio) url += `&data__gte=${dataInicio}`;
      if (dataFim) url += `&data__lte=${dataFim}`;
      try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Erro ao buscar sessões");
        const sessoes = await resp.json();
        if (sessoes.length === 0) {
          listaSessoes.innerHTML = "<div class='alert alert-warning'>Nenhum registro encontrado.</div>";
          return;
        }
        listaSessoes.innerHTML = sessoes.map(sessao => `
          <div class="border rounded p-2 mb-2">
            <div><b>Data:</b> ${formatarDataBR(sessao.data)}</div>
            <div><b>Observações:</b> ${sessao.observacoes || '-'}</div>
            <div><b>Regiões de Dor:</b>
              <ul>
                ${sessao.regioes.map(r => 
                  `<li>${nomesRegioes[r.regiao] || r.regiao}: ${r.valor}</li>`
                ).join('')}
              </ul>
            </div>
          </div>
        `).join('');
      } catch (err) {
        listaSessoes.innerHTML = "<div class='alert alert-danger'>Erro ao buscar sessões.</div>";
      }
    }

    flatpickr("#dataInicio", { dateFormat: "d/m/Y", locale: "pt" });
    flatpickr("#dataFim", { dateFormat: "d/m/Y", locale: "pt" });
