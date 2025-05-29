import { API_BASE_URL } from '../config.js';

   // Script para o mapa de dor
    const nomesRegioes = {
      ombro_direito: "Ombro Direito",
      ombro_esquerdo: "Ombro Esquerdo",
      cotovelo_esquerdo: "Cotovelo Esquerdo",
      cotovelo_direito: "Cotovelo Direito",
      punho_direito: "Punho Direito",
      punho_esquerdo: "Punho Esquerdo",
      quadril_direito: "Quadril Direito",
      quadril_esquerdo: "Quadril Esquerdo",
      joelho_direito: "Joelho Direito",
      joelho_esquerdo: "Joelho Esquerdo",
      tornozelo_direito: "Tornozelo Direito",
      tornozelo_esquerdo: "Tornozelo Esquerdo"
    };
    const selectedRegions = {};
    const resultadoEl = document.getElementById("resultado");
    const modalTitle = document.getElementById("modalTitle");
    const dorInput = document.getElementById("dorInput");
    const obsInput = document.getElementById("obsInput");
    const btnSalvar = document.getElementById("btnSalvar");
    const btnCancelar = document.getElementById("btnCancelar");
    let currentRegionId = null;
    let bsModal = new bootstrap.Modal(document.getElementById('modalDor'));

    // Função para abrir modal
    function abrirModal(regionId) {
      currentRegionId = regionId;
      const nomeAmigavel = nomesRegioes[regionId] || regionId.replace(/_/g, ' ');
      modalTitle.textContent = nomeAmigavel;
      dorInput.value = selectedRegions[regionId]?.valor ?? '';
      obsInput.value = selectedRegions[regionId]?.obs ?? '';
      bsModal.show();
      setTimeout(() => dorInput.focus(), 300);
    }

    // Função para fechar modal
    function fecharModal() {
      bsModal.hide();
      currentRegionId = null;
      dorInput.value = '';
      obsInput.value = '';
    }

    // Atualiza resultado na tela
    function atualizarResultado() {
      resultadoEl.textContent = JSON.stringify(selectedRegions, null, 2);
    }

    // Evento de clique em cada região (rect)
    document.querySelectorAll("svg rect").forEach(rect => {
      rect.addEventListener("click", () => {
        abrirModal(rect.id);
      });
    });

    // Salvar botão no modal
    btnSalvar.addEventListener("click", () => {
      const val = parseInt(dorInput.value, 10);
      const obs = obsInput.value.trim();
      if (isNaN(val) || val < 0 || val > 10) {
        alert("Por favor, insira um valor entre 0 e 10.");
        dorInput.focus();
        return;
      }
      selectedRegions[currentRegionId] = { valor: val, obs: obs };
      // Marca visualmente
      document.getElementById(currentRegionId).classList.add("selected");
      atualizarResultado();
      fecharModal();
    });

    // Cancelar botão no modal
    btnCancelar.addEventListener("click", fecharModal);

    // Atualiza resultado inicial (vazio)
    atualizarResultado();

// Script para o buscador de pacientes

    const inputBusca = document.getElementById("busca");
    const resultadoBusca = document.getElementById("resultadoBusca");
    const formBusca = document.getElementById("buscarPacienteForm");

    // Variável global para paciente selecionado
    let pacienteSelecionado = null;

    // Modifique o evento do buscador para salvar o paciente selecionado
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
                pacienteSelecionado = paciente; // <-- Salva o paciente selecionado
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

    // Opcional: ação ao submeter o formulário
    formBusca.addEventListener("submit", function(e) {
      e.preventDefault();
      // Você pode buscar e exibir dados do paciente selecionado aqui
    });

    // Função para salvar o registro de sessão
    async function salvarRegistroSessao() {
      if (!pacienteSelecionado) {
        alert("Selecione um paciente antes de salvar!");
        return;
      }
      if (Object.keys(selectedRegions).length === 0) {
        alert("Selecione pelo menos uma região de dor!");
        return;
      }
      // Monta o objeto regioes_de_dor apenas com os valores
      const regioes = Object.entries(selectedRegions).map(([regiao, info]) => ({
        regiao: regiao,
        valor: info.valor
      }));

      const observacoes = document.getElementById("observacoesGerais").value.trim();

      const data = {
          paciente: pacienteSelecionado.id,
          observacoes,
          regioes
        };

      try {
        const resp = await fetch(`${API_BASE_URL}/registros-sessao/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!resp.ok) throw new Error("Erro ao salvar registro");
        alert("Registro salvo com sucesso!");
      } catch (err) {
        alert("Erro ao salvar: " + err.message);
      }
    }

    // Conecte o botão ao JS:
    document.getElementById("btnSalvarRegistro").addEventListener("click", salvarRegistroSessao);
