// forcaMuscularChart.js
export class ForcaMuscularChart {
    constructor(canvasId, noDataMessageId, filterContainerId) {
      this.canvas = document.getElementById(canvasId);
      this.noDataMessage = document.getElementById(noDataMessageId);
      this.filterContainer = document.getElementById(filterContainerId);
      this.chart = null;
    }
  
    render(pacienteData, filterDate = null) {
      if (!pacienteData || !pacienteData.dadosdeforcamuscular || pacienteData.dadosdeforcamuscular.length === 0) {
        this._hideChart();
        return;
      }
  
      let forcasMusculares = this._processData(pacienteData.dadosdeforcamuscular, filterDate);
      
      if (forcasMusculares.length === 0) {
        this._hideChart();
        return;
      }
  
      this._showChart();
      this._renderChart(forcasMusculares, filterDate);
    }
  
    _processData(forcasMusculares, filterDate) {
      // Converter strings de data para objetos Date
      forcasMusculares = forcasMusculares.map(fm => ({
        ...fm,
        dataObj: new Date(fm.data_avaliacao)
      }));
      
      // Ordenar por data (mais recente primeiro)
      forcasMusculares.sort((a, b) => b.dataObj - a.dataObj);
      
      // Filtrar por data se um filtro foi aplicado
      if (filterDate) {
        forcasMusculares = forcasMusculares.filter(fm => {
          return fm.dataObj.toDateString() === new Date(filterDate).toDateString();
        });
      }
      
      // Criar um mapa para manter apenas o registro mais recente de cada musculatura
      const musculaturasUnicas = new Map();
      for (const fm of forcasMusculares) {
        if (!musculaturasUnicas.has(fm.musculatura)) {
          musculaturasUnicas.set(fm.musculatura, fm);
        }
      }
      
      return Array.from(musculaturasUnicas.values());
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
  
    _renderChart(forcasMusculares, filterDate) {
      if (this.chart) {
        this.chart.destroy();
      }
  
      const nomesMusculatura = forcasMusculares.map(fm => fm.musculatura);
      const ladoEsquerdo = forcasMusculares.map(fm => parseInt(fm.lado_esquerdo));
      const ladoDireito = forcasMusculares.map(fm => parseInt(fm.lado_direito));
      const assimetria = this._calculateAssimetry(ladoEsquerdo, ladoDireito);
  
      const ctx = this.canvas.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: nomesMusculatura,
          datasets: [
            {
              label: 'Lado Esquerdo',
              data: ladoEsquerdo,
              backgroundColor: '#B7DE42',
              borderColor: '#B7DE42',
              borderWidth: 1,
              yAxisID: 'y'
            },
            {
              label: 'Lado Direito',
              data: ladoDireito,
              backgroundColor: '#0A0A0A',
              borderColor: '#0A0A0A',
              borderWidth: 1,
              yAxisID: 'y'
            },
            {
              label: 'Assimetria (%)',
              data: assimetria,
              type: 'line',
              borderColor: 'rgba(255, 159, 64, 1)',
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              borderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
              fill: false,
              yAxisID: 'y-assimetria'
            }
          ]
        },
        options: this._getChartOptions(forcasMusculares, ladoEsquerdo, ladoDireito, filterDate)
      });
    }
  
    _calculateAssimetry(ladoEsquerdo, ladoDireito) {
      return ladoEsquerdo.map((esq, i) => {
        const dir = ladoDireito[i];
        const total = esq + dir || 1;
        return Math.round(((dir - esq) / total) * 100);
      });
    }
  
    _getChartOptions(forcasMusculares, ladoEsquerdo, ladoDireito, filterDate) {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              color: 'white' // Cor dos rótulos do eixo X (nomes das musculaturas)
            }
          },
          y: {
            beginAtZero: true,
            title: { 
              display: true,
              text: 'Nível de Força',
              color: 'white' // Cor do título do eixo Y
            },
            ticks: {
              color: 'white' // Cor dos rótulos do eixo Y
            },
            suggestedMax: Math.max(...ladoEsquerdo, ...ladoDireito) * 1.1,
            position: 'left'
          },
          'y-assimetria': {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Assimetria (%)',
              color: 'white' // Cor do título do eixo Y-assimetria
            },
            min: -100,
            max: 100,
            position: 'right', // Garante que o eixo de assimetria fique à direita
            grid: {
              drawOnChartArea: false // Remove as linhas de grade do eixo de assimetria
            },
            ticks: {
              color: 'white', // Cor dos rótulos do eixo Y-assimetria
              callback: function(value) {
                return value + '%';
              }
            }
          },
        },
        plugins: {
          title: {
            display: true,
            text: filterDate 
              ? `Força Muscular - Avaliação em ${new Date(filterDate).toLocaleDateString('pt-BR')}` 
              : 'Força Muscular',
            font: { size: 12 },
            color: 'white' // Cor do título do gráfico
          },
          legend: {
            labels: {
              color: 'white' // Cor dos textos da legenda
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const datasetLabel = context.dataset.label || '';
                const value = context.raw;
                if (datasetLabel === 'Assimetria (%)') {
                  return `${datasetLabel}: ${value}%`;
                }
                return `${datasetLabel}: ${value}`;
              }
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
