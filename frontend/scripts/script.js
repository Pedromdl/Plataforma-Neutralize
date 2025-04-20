import { ChartsManager } from './chartsManager.js';

const chartsManager = new ChartsManager();

// Captura o elemento do filtro de data
const filtroDataUnico = document.getElementById('filtroDataUnico');

// Adiciona um evento para quando a data for alterada
filtroDataUnico.addEventListener('change', () => {
  const dataSelecionada = filtroDataUnico.value;

  if (!dataSelecionada) {
    alert('Por favor, selecione uma data válida.');
    return;
  }

  // Atualiza todos os gráficos com base na data selecionada
  chartsManager.atualizarTodosOsGraficos(dataSelecionada);
});