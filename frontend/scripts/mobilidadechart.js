// mobilidadeChart.js
export class MobilidadeChart {
    constructor(canvasId, noDataMessageId, filterContainerId) {
      this.canvas = document.getElementById(canvasId);
      this.noDataMessage = document.getElementById(noDataMessageId);
      this.filterContainer = document.getElementById(filterContainerId);
      this.chart = null;
    }
  
    render(pacienteData, filterDate = null) {

      console.log("Dados recebidos para renderização no MobilidadeChart:", pacienteData);

      if (!pacienteData || !pacienteData.mobilidades || pacienteData.mobilidades.length === 0) {
        this._hideChart();
        return;
      }
  
      let mobilidades = this._processData(pacienteData.mobilidades, filterDate);
      
      if (mobilidades.length === 0) {
        this._hideChart();
        return;
      }
  
      this._showChart();
      this._renderChart(mobilidades, filterDate);
    }
  
    _processData(mobilidades, filterDate) {
      // Converter strings de data para objetos Date
      mobilidades = mobilidades.map(mob => ({
        ...mob,
        dataObj: new Date(mob.data_avaliacao)
      }));
      
      // Ordenar por data (mais recente primeiro)
      mobilidades.sort((a, b) => b.dataObj - a.dataObj);
      
      // Filtrar por data se um filtro foi aplicado
      if (filterDate) {
        mobilidades = mobilidades.filter(mob => {
          return mob.dataObj.toDateString() === new Date(filterDate).toDateString();
        });
      }
      
      // Criar um mapa para manter apenas o registro mais recente de cada tipo de mobilidade
      const mobilidadesUnicas = new Map();
      for (const mob of mobilidades) {
        if (!mobilidadesUnicas.has(mob.nome)) {
          mobilidadesUnicas.set(mob.nome, mob);
        }
      }
      
      return Array.from(mobilidadesUnicas.values());
    }
  
    _hideChart() {
      this.canvas.style.display = 'none';
      this.noDataMessage.style.display = 'block';
      this.filterContainer.style.display = 'none';
      
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
    }
  
    _showChart() {
      this.noDataMessage.style.display = 'none';
      this.canvas.style.display = 'block';
      this.filterContainer.style.display = 'block';
    }
  
    _renderChart(mobilidades, filterDate) {
      if (this.chart) {
        this.chart.destroy();
      }
  
      const nomesMobilidade = mobilidades.map(mob => mob.nome);
      const ladoEsquerdo = mobilidades.map(mob => parseInt(mob.lado_esquerdo));
      const ladoDireito = mobilidades.map(mob => parseInt(mob.lado_direito));
  
      const ctx = this.canvas.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: nomesMobilidade,
          datasets: [
            {
              label: 'Lado Esquerdo',
              data: ladoEsquerdo,
              backgroundColor: '#B7DE42',
              borderColor: '#B7DE42',
              borderWidth: 1
            },
            {
              label: 'Lado Direito',
              data: ladoDireito,
              backgroundColor:  '#0A0A0A',
              borderColor:  '#0A0A0A',
              borderWidth: 1
            }
          ]
        },
        options: this._getChartOptions(mobilidades, filterDate)
      });
    }
  
    _getChartOptions(mobilidades, filterDate) {
      const ladoEsquerdo = mobilidades.map(mob => parseInt(mob.lado_esquerdo));
      const ladoDireito = mobilidades.map(mob => parseInt(mob.lado_direito));
  
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              color: 'white' // Cor dos rótulos do eixo X (nomes das mobilidades)
            }
          },
          y: {
            beginAtZero: true,
            title: { 
              display: true,
              text: 'Graus de Movimento',
              color: 'white' // Cor do título do eixo Y
            },
            ticks: {
              color: 'white' // Cor dos rótulos do eixo Y
            },
            suggestedMax: Math.max(...ladoEsquerdo, ...ladoDireito) + 10
          }
        },
        plugins: {
          title: {
            display: true,
            text: filterDate 
              ? `Mobilidade Articular - Avaliação em ${new Date(filterDate).toLocaleDateString('pt-BR')}` 
              : 'Mobilidade Articular',
            font: { size: 12 },
            color: 'white' // Cor do título do gráfico
          },
          legend: {
            labels: {
              color: 'white' // Cor dos textos da legenda
            }
          }
        }
      };
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}
