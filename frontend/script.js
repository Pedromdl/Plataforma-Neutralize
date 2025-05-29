import { initSearch } from './scripts/search.js';
import { initFormHandler } from './scripts/formHandler.js';
import { initDropdownHandler } from './scripts/dropdown.js';
import { ChartsManager } from './scripts/dashboard/chartsManager.js';
import { SemanasAvaliacao } from './scripts/semanasAvaliacao.js';


document.addEventListener("DOMContentLoaded", function () {
  const chartsManager = new ChartsManager();
  initSearch(chartsManager);
  initFormHandler(chartsManager);
  initDropdownHandler();

  // Filtro de data único
  const filtroDataUnico = document.getElementById('filtroDataUnico');
  if (filtroDataUnico) {
    filtroDataUnico.addEventListener('change', function () {
      chartsManager.atualizarTodosOsGraficos(this.value);
    });

    
  }
  
  const semanasAvaliacao = new SemanasAvaliacao(
    'dadosSemanasAvaliacao',
    'semDadosSemanas',
    'listaSemanasAvaliacao'
);

// Substitua pelo ID real do paciente
const pacienteId = 1;

// Buscar e renderizar os dados
semanasAvaliacao.fetchAndRender(pacienteId);

document.getElementById('toggleSidebar').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.content');
    sidebar.classList.toggle('hidden');
    content.classList.toggle('expanded');
});

});
