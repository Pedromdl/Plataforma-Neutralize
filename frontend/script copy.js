import { ChartsManager } from './scripts/chartsManager.js';
let chartsManager; // Declarando a variável no escopo global

document.addEventListener("DOMContentLoaded", function () {
  chartsManager = new ChartsManager(); // Inicializa após o DOM carregar

  const inputBusca = document.getElementById("busca");
  const resultadoBusca = document.getElementById("resultadoBusca");

  // Evento de digitação no campo de busca
  inputBusca.addEventListener("input", async () => {
    const query = inputBusca.value.trim();

    // Limpa os resultados anteriores
    resultadoBusca.innerHTML = "";

    if (query.length > 1) { // Busca apenas se houver mais de 2 caracteres
      try {
        // Faz a requisição para o backend
        const response = await fetch(`http://localhost:8000/buscar-pacientes/?search=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar pacientes");
        }

        const pacientes = await response.json();

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
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
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
});

document.getElementById('buscarPacienteForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const termoBusca = document.getElementById('busca').value.trim();
  
  // Mostrar loading
  const btnSubmit = e.target.querySelector('button[type="submit"]');
  const btnOriginalText = btnSubmit.innerHTML;
  btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Buscando...';
  btnSubmit.disabled = true;

  try {
    const response = await fetch(`http://localhost:8000/buscar-pacientes/?search=${encodeURIComponent(termoBusca)}`);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Formato de dados inválido da API');
    }

    const dadosPaciente = document.querySelector('#dadosPaciente .paciente-info');
    const dadosForcaMuscular = document.getElementById('dadosForcaMuscular');
    const dadosMobilidade = document.getElementById('dadosMobilidade');
    const dadosEscalasQuestionarios = document.getElementById('dadosEscalasQuestionarios');
    const dadosTestesFuncao = document.getElementById('dadosTestesFuncao');

    
    // Destruir gráficos existentes antes de renderizar novos
    chartsManager.destroyAll();
    
    // Ocultar seções e mensagens de sem dados inicialmente
    document.getElementById('semDadosGrafico').style.display = 'none';
    document.getElementById('semDadosGraficoForca').style.display = 'none';
    document.getElementById('semDadosEscalas').style.display = 'none';
    document.getElementById('graficoMobilidade').style.display = 'none';
    document.getElementById('graficoForcaMuscular').style.display = 'none';
    document.getElementById('graficoEscalasQuestionarios').style.display = 'none';
    document.getElementById('semDadosTesteFuncao').style.display = 'none';
    document.getElementById('graficoTesteFuncao').style.display = 'none';



    if (data.length > 0) {
      const paciente = data[0];
      dadosPaciente.innerHTML = ` 
        <p><strong>Nome:</strong> ${paciente.nome}</p>
        <p><strong>Idade:</strong> ${paciente.idade}</p>
        ${paciente.cpf ? `<p><strong>CPF:</strong> ${paciente.cpf}</p>` : ''}
        <p><strong>Diagnóstico:</strong> ${paciente.diagnostico}</p>
      `;

      // Mostrar seções mesmo sem dados
      dadosMobilidade.style.display = 'block';
      dadosForcaMuscular.style.display = 'block';
      dadosEscalasQuestionarios.style.display = 'block';
      dadosTestesFuncao.style.display = 'block';


      // Verificar se o paciente tem dados de escalas e questionários
      if (!paciente.escalasequestionarios) {
        paciente.escalasequestionarios = []; // Garante que a propriedade exista
      }

      // Renderizar gráficos
      chartsManager.renderAll(paciente);
    } else {
      dadosPaciente.innerHTML = '<p class="text-muted">Nenhum paciente encontrado.</p>';
      dadosForcaMuscular.style.display = 'none';
      dadosMobilidade.style.display = 'none';
      dadosEscalasQuestionarios.style.display = 'none';
      dadosTestesFuncao.style.display = 'none';

    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao buscar paciente: ' + error.message);
  } finally {
    // Restaurar botão
    btnSubmit.innerHTML = btnOriginalText;
    btnSubmit.disabled = false;
  }
});
