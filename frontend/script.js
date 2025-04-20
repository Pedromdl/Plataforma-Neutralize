import { initSearch } from './scripts/search.js';
import { initFormHandler } from './scripts/formHandler.js';
import { initDropdownHandler } from './scripts/dropdown.js';
import { ChartsManager } from './scripts/chartsManager.js';

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
  
});
