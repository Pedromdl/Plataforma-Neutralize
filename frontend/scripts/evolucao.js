import { EvolucaoChartsManager } from './evolucaoChartsManager.js';
import { initSearch } from './search.js';
import { initFormHandler } from './formHandler.js';
import { initDropdownHandler } from './dropdown.js';

document.addEventListener('DOMContentLoaded', () => {
    const chartsManager = new EvolucaoChartsManager();
    initSearch(chartsManager);
    initFormHandler(chartsManager);
    initDropdownHandler();
});