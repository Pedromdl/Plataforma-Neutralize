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

    const dadosMobilidadeFiltrados = this.filtrarDadosPorData(this.dadosMobilidade || [], data);
    const dadosForcaFiltrados = this.filtrarDadosPorData(this.dadosForca || [], data);
    const dadosEscalasFiltrados = this.filtrarDadosPorData(this.dadosEscalas || [], data);
    const dadosTesteFuncaoFiltrados = this.filtrarDadosPorData(this.dadosTesteFuncao || [], data);

    console.log("Dados filtrados para mobilidade:", dadosMobilidadeFiltrados);
    console.log("Dados filtrados para força muscular:", dadosForcaFiltrados);
    console.log("Dados filtrados para escalas:", dadosEscalasFiltrados);
    console.log("Dados filtrados para testes de função:", dadosTesteFuncaoFiltrados);

    this.mobilidadeChart.render({ mobilidades: dadosMobilidadeFiltrados });
    this.forcaMuscularChart.render({ forcaMuscular: dadosForcaFiltrados });
    this.escalasQuestionariosChart.render({ escalasQuestionarios: dadosEscalasFiltrados });
    this.testeFuncaoChart.render({ testesFuncao: dadosTesteFuncaoFiltrados });
  }

  // Filtrar dados com base na data
  filtrarDadosPorData(dados, data) {
    return dados.filter(item => item.data === data);
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
    this.mobilidadeChart.render(pacienteData);
    this.forcaMuscularChart.render(pacienteData);
    this.escalasQuestionariosChart.render(pacienteData);
    this.testeFuncaoChart.render(pacienteData);
  }
}
