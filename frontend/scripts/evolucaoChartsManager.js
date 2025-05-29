import { EvolucaoMobilidadeChart } from './evolucaoMobilidadeChart.js';

export class EvolucaoChartsManager {
  constructor() {
    this.evolucaoMobilidadeChart = new EvolucaoMobilidadeChart(
      'graficoMobilidade',
      'semDadosGrafico',
      'filtroDataMobilidade'
    );

  }

  // Atualizar todos os gráficos com base na data selecionada
  atualizarTodosOsGraficos(data) {
    console.log("Atualizando gráficos para a data:", data);

    console.log("Dados de mobilidade:", this.dadosMobilidade);

    const dadosMobilidadeFiltrados = this.filtrarDadosPorData(this.dadosMobilidade || [], data);


    console.log("Dados filtrados para mobilidade:", dadosMobilidadeFiltrados);

    // Renderizar gráfico de mobilidade
    this.evolucaoMobilidadeChart.render({ mobilidades: dadosMobilidadeFiltrados });

  }

  // Filtrar dados com base na data
  filtrarDadosPorData(dados, data) {
    return dados.filter(item => {
        // Identifica o campo de data correto
        const campoData = item.data_avaliacao;

        if (!campoData) {
            console.warn("Item sem campo de data:", item);
            return false; // Ignora itens sem campo de data
        }

        // Normaliza a data para o formato 'YYYY-MM-DD'
        const dataItem = new Date(campoData).toISOString().split('T')[0];
        return dataItem === data;
    });
  }

  // Destruir todos os gráficos
  destroyAll() {
    this.evolucaoMobilidadeChart.destroy();
  }

  // Renderizar todos os gráficos com os dados do paciente
  renderAll(pacienteData) {
    console.log("Renderizando todos os gráficos com os dados do paciente:", pacienteData);

    // Renderizar gráfico de mobilidade
    if (Array.isArray(pacienteData.mobilidades)) {
        this.evolucaoMobilidadeChart.render(pacienteData.mobilidades);
    } else {
        console.error("A propriedade 'mobilidades' não é um array:", pacienteData.mobilidades);
    }
  }
}
