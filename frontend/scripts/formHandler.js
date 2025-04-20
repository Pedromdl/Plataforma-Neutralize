import { API_BASE_URL } from '../config.js';


export function initFormHandler(chartsManager) {
  document.getElementById('buscarPacienteForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const termoBusca = document.getElementById('busca').value.trim();
    const btnSubmit = e.target.querySelector('button[type="submit"]');
    const btnOriginalText = btnSubmit.innerHTML;

    btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Buscando...';
    btnSubmit.disabled = true;

    try {
      const response = await fetch(`${API_BASE_URL}/buscar-pacientes/?search=${encodeURIComponent(termoBusca)}`);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Formato de dados inválido da API');

      const dadosPaciente = document.querySelector('#dadosPaciente .paciente-info');
      const dadosForcaMuscular = document.getElementById('dadosForcaMuscular');
      const dadosMobilidade = document.getElementById('dadosMobilidade');
      const dadosEscalasQuestionarios = document.getElementById('dadosEscalasQuestionarios');
      const dadosTestesFuncao = document.getElementById('dadosTestesFuncao');

      chartsManager.destroyAll();

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
          <p><strong>Idade:</strong> ${paciente.idade ? paciente.idade : 'Não informada'}</p>
          ${paciente.cpf ? `<p><strong>CPF:</strong> ${paciente.cpf}</p>` : ''}
        `;

        chartsManager.dadosMobilidade = paciente.mobilidades || [];
        chartsManager.dadosForca = paciente.dadosdeforcamuscular || [];
        chartsManager.dadosEscalas = paciente.escalasequestionarios || [];
        chartsManager.dadosTesteFuncao = paciente.dadosdetestes || [];

        dadosMobilidade.style.display = 'block';
        dadosForcaMuscular.style.display = 'block';
        dadosEscalasQuestionarios.style.display = 'block';
        dadosTestesFuncao.style.display = 'block';

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
      btnSubmit.innerHTML = btnOriginalText;
      btnSubmit.disabled = false;
    }
  });
}