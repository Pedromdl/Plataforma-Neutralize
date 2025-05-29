import { MobilidadeChart } from './mobilidadechart.js';
import { ForcaMuscularChart } from './forcaMuscularChart.js';
import { escalasQuestionariosChart } from './escalasQuestionariosChart.js';
import { TesteFuncaoChart } from './testeFuncaoChart.js';

export class ChartsManager {
  constructor() {
    this.mobilidadeChart = new MobilidadeChart(
      'graficoMobilidade',
      'semDadosGrafico',
      'filtroDataMobilidade'
    );

    this.forcaMuscularChart = new ForcaMuscularChart(
      'graficoForcaMuscular',
      'semDadosGraficoForca',
      'filtroDataForcaMuscular'
    );

    this.escalasQuestionariosChart = new escalasQuestionariosChart(
      'graficoEscalasQuestionarios',
      'semDadosEscalas',
      'filtroDataEscalas'
    );

    this.testeFuncaoChart = new TesteFuncaoChart(
      'graficoTesteFuncao',
      'semDadosTesteFuncao',
      'filtroDataTesteFuncao'
    );
  }

  // Atualizar todos os gráficos com base na data selecionada
  atualizarTodosOsGraficos(data) {
    console.log("Atualizando gráficos para a data:", data);

    console.log("Dados de mobilidade:", this.dadosMobilidade);
    console.log("Dados de força muscular:", this.dadosForca);
    console.log("Dados de escalas/questionários:", this.dadosEscalas);
    console.log("Dados de testes de função:", this.dadosTesteFuncao);

    const dadosMobilidadeFiltrados = this.filtrarDadosPorData(this.dadosMobilidade || [], data);
    const dadosForcaFiltrados = this.filtrarDadosPorData(this.dadosForca || [], data);
    const dadosEscalasFiltrados = this.filtrarDadosPorData(this.dadosEscalas || [], data);
    const dadosTesteFuncaoFiltrados = this.filtrarDadosPorData(this.dadosTesteFuncao || [], data);

    console.log("Dados filtrados para mobilidade:", dadosMobilidadeFiltrados);
    console.log("Dados filtrados para força muscular:", dadosForcaFiltrados);
    console.log("Dados filtrados para escalas:", dadosEscalasFiltrados);
    console.log("Dados filtrados para testes de função:", dadosTesteFuncaoFiltrados);

    // Renderizar gráfico de mobilidade
    this.mobilidadeChart.render({ mobilidades: dadosMobilidadeFiltrados });

    // Renderizar gráfico de força muscular
    this.forcaMuscularChart.render({ dadosdeforcamuscular: dadosForcaFiltrados });

    // Renderizar gráfico de escalas/questionários
    this.escalasQuestionariosChart.render({ escalasequestionarios: dadosEscalasFiltrados });

    // Renderizar gráfico de testes de função
    this.testeFuncaoChart.render({ dadosdetestes: dadosTesteFuncaoFiltrados });
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
    this.mobilidadeChart.destroy();
    this.forcaMuscularChart.destroy();
    this.escalasQuestionariosChart.destroy();
    this.testeFuncaoChart.destroy();
  }

  // Renderizar todos os gráficos com os dados do paciente
  renderAll(pacienteData) {
    console.log("Renderizando todos os gráficos com os dados do paciente:", pacienteData);

    // Renderizar gráfico de mobilidade
    this.mobilidadeChart.render({ mobilidades: pacienteData.mobilidades });

    // Renderizar gráfico de força muscular
    this.forcaMuscularChart.render({ dadosdeforcamuscular: pacienteData.dadosdeforcamuscular });

    // Renderizar gráfico de escalas/questionários
    this.escalasQuestionariosChart.render({ escalasequestionarios: pacienteData.escalasequestionarios });

    // Renderizar gráfico de testes de função
    this.testeFuncaoChart.render({ dadosdetestes: pacienteData.dadosdetestes });
  }
}
