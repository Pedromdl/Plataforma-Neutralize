export class escalasQuestionariosChart {
    constructor(canvasId, noDataMessageId, filterContainerId) {
      this.canvas = document.getElementById(canvasId);
      this.noDataMessage = document.getElementById(noDataMessageId);
      this.filterContainer = document.getElementById(filterContainerId);
      this.chart = null;
    }
  
    render(pacienteData, filterDate = null) {
      console.log("Dados recebidos para renderização no EscalasQuestionariosChart:", pacienteData);

      if (!pacienteData || !pacienteData.escalasequestionarios || pacienteData.escalasequestionarios.length === 0) {
        this._hideChart();
        return;
      }
  
      let escalas = this._processData(pacienteData.escalasequestionarios, filterDate);
      
      if (escalas.length === 0) {
        this._hideChart();
        return;
      }
  
      this._showChart();
      this._renderChart(escalas, filterDate);
    }
  
    _processData(escalas, filterDate) {
      // Converter strings de data para objetos Date
      escalas = escalas.map(esc => ({
        ...esc,
        dataObj: new Date(esc.data_avaliacao)
      }));
      
      // Ordenar por data (mais recente primeiro)
      escalas.sort((a, b) => b.dataObj - a.dataObj);
      
      // Filtrar por data se um filtro foi aplicado
      if (filterDate) {
        escalas = escalas.filter(esc => {
          return esc.dataObj.toDateString() === new Date(filterDate).toDateString();
        });
      }
      
      // Criar um mapa para manter apenas o registro mais recente de cada escala/questionário
      const escalasUnicas = new Map();
      for (const esc of escalas) {
        if (!escalasUnicas.has(esc.nome)) {
          escalasUnicas.set(esc.nome, esc);
        }
      }
      
      return Array.from(escalasUnicas.values());
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
  
    _renderChart(escalas, filterDate) {
      if (this.chart) {
        this.chart.destroy();
      }
  
      const nomesEscalas = escalas.map(esc => esc.nome);
      const resultados = escalas.map(esc => {
        // Tenta converter para número, se não for possível mantém como string
        const num = parseFloat(esc.resultado);
        return isNaN(num) ? esc.resultado : num;
      });
  
      const ctx = this.canvas.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: nomesEscalas,
          datasets: [{
            label: 'Resultado',
            data: resultados,
            backgroundColor: '#B7DE42',
            borderColor: '#B7DE42',
            borderWidth: 1
          }]
        },
        options: this._getChartOptions(escalas, filterDate)
      });
    }
  
    _getChartOptions(escalas, filterDate) {
      const resultadosNumericos = escalas
        .map(esc => parseFloat(esc.resultado))
        .filter(num => !isNaN(num));
      
      const temNumericos = resultadosNumericos.length > 0;
    
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              color: 'white' // Cor dos rótulos do eixo X (nomes das escalas)
            }
          },
          y: {
            beginAtZero: temNumericos,
            title: { 
              display: true,
              text: 'Resultado',
              color: 'white' // Cor do título do eixo Y
            },
            ticks: {
              color: 'white' // Cor dos rótulos do eixo Y
            },
            ...(temNumericos && {
              suggestedMax: Math.max(...resultadosNumericos) * 1.1
            })
          }
        },
        plugins: {
          title: {
            display: true,
            text: filterDate 
              ? `Escalas e Questionários - Avaliação em ${new Date(filterDate).toLocaleDateString('pt-BR')}` 
              : 'Escalas e Questionários',
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
                const data = escalas[context.dataIndex];
                return [
                  `Escala: ${data.nome}`,
                  `Data: ${data.dataObj.toLocaleDateString('pt-BR')}`,
                  `Resultado: ${data.resultado}`
                ];
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
